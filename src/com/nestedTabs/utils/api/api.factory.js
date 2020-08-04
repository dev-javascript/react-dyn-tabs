import BaseApi from './baseApi';
import events from '../events';
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, helper, getUserProxy,
        activedTabsHistoryIns, observablePatternIns } = getDeps(param.options);
    BaseApi.call(this, helper);
    helper.objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        _helper: helper,
        _panelProxy: panelProxyIns,
        activedTabsHistory: activedTabsHistoryIns,
        observable: observablePatternIns,
        userProxy: getUserProxy(this)
    });
};
api.prototype = Object.create(BaseApi.prototype);
api.prototype.constructor = api;
api.prototype.getOptions = function () { return this.optionManager.getMutableOptions(); };
api.prototype.getCopyData = function () { return this._helper.getCopyState(this.state); };
api.prototype.getInitialState = function () {
    const { data: { activeTabId, openTabsId } } = this.getOptions();
    return { activeTabId, openTabsId };
};
api.prototype.getTabObj = function (tabId) {
    const tabs = this.getOptions().data.allTabs;
    if (tabs.hasOwnProperty(tabId))
        return tabs[tabId];
    return null;
};
api.prototype.getPanel = function (id) {
    return this._panelProxy.getPanel(id
        , this.getOptions().data.allTabs[id].panelComponent);
};
api.prototype.getSelectedTabsHistory = function () { return this.activedTabsHistory.tabsId; };
api.prototype.isActiveTab = function (id) { return this.state.activeTabId == id; };
api.prototype.isOpenTab = function (id) { return this.state.openTabsId.indexOf(id) >= 0; };
api.prototype._beforeSwitchTab = function ({ id, e }) { return this.getOptions().events.beforeSwitchTab({ id, e }); };
api.prototype.eventHandlerFactory = function ({ e, id }) {
    //test mutablitiy of events
    const { events, switchTabEventMode, closeTabEventMode } = this.getOptions()
        , { type } = e;
    events[`on${type}Tab`].call(this, { e, id });
    e.target.className.includes(this.optionManager.setting.defaultCssClasses.closeIcon) ?
        (type === closeTabEventMode && this.closeTab({ e, id }, true))
        : (type === switchTabEventMode && this.switchTab({ e, id }));
};
{
    const _switchToSiblingTab = function ({ e }, traverseToNext) {
        let index;
        const increaseOrDecrease = traverseToNext ? (value => value + 1) : (value => value - 1)
            , openTabsId = this.state.openTabsId
            , _length = openTabsId.length
            , tabs = this.getOptions().data.allTabs
            , { resolve, checkArrIndex } = this._helper;
        index = increaseOrDecrease(openTabsId.indexOf(this.state.activeTabId));
        if (!checkArrIndex(index, _length))
            return resolve(null);
        while (tabs[openTabsId[index]].disable) {
            index = increaseOrDecrease(index);
            if (!checkArrIndex(index, _length))
                return resolve(null);
        }
        return this.switchTab({ id: this.state.openTabsId[index], e });
    };
    const _switchTab = function (id) {
        const options = this.getOptions(), activeTabId = this.state.activeTabId;
        activeTabId && this.activedTabsHistory.addTab(activeTabId);
        id && this._panelProxy.addRenderedPanel(id);
        this._activeTab(id);
        return Promise.all([new Promise(resolve => {
            this.observable.createSubscriber(function (param) {
                resolve(param);
                this.unSubscribe(events.tabListDidUpdateByActiveTabId);
            }).subscribe(events.tabListDidUpdateByActiveTabId);
        }), new Promise(resolve => {
            this.observable.createSubscriber(function (param) {
                resolve(param);
                this.unSubscribe(events.panelListDidUpdateByActiveTabId);
            }).subscribe(events.panelListDidUpdateByActiveTabId);
        })])
            .then(([tab, panel]) => {
                options.events.afterSwitchTab.call(this, { ...tab });
                return { ...tab };
            }).catch(function (err) {
                throw err.message;
            });
    };
    api.prototype.switchTab = (function () {
        const _validate = function (selectedTabId) { return !this.isActiveTab(selectedTabId) && this.isOpenTab(selectedTabId); }
        return function ({ id, e }) {
            if (!_validate.call(this, id) || !this._beforeSwitchTab({ id, e }))
                return this._helper.resolve(null);
            return _switchTab.call(this, id);
        };
    })();
    api.prototype.deselectTab = function (e) {
        const id = this.state.activeTabId, { resolve } = this._helper;
        if (!id || !this._beforeSwitchTab({ id, e }))
            return resolve(null);
        return _switchTab.call(this, '');
    };
    api.prototype._switchToUnknowTab = function ({ e }) {
        return this.switchToPreSelectedTab({ e })
            .then(result => result ? this._helper.resolve(result) : this.switchToPreSiblingTab({ e }))
            .then(result => result ? this._helper.resolve(result) : this.switchToNxtSiblingTab({ e }))
            .then(result => result ? this._helper.resolve(result) : this.deselectTab({ e }));
    };
    api.prototype.switchToNxtSiblingTab = function ({ e }) { return _switchToSiblingTab.call(this, { e }, true); };
    api.prototype.switchToPreSiblingTab = function ({ e }) { return _switchToSiblingTab.call(this, { e }, false); };
    api.prototype.switchToPreSelectedTab = function ({ e }) {
        let id;
        const tabs = this.getOptions().data.allTabs
            , openTabsId = this.state.openTabsId
        while (!id) {
            const tempId = this.activedTabsHistory.getTab();
            if (tempId == undefined)//if activedTabsHistory array length is 0
                return this._helper.resolve(null);
            ((openTabsId.indexOf(tempId) >= 0) && (!tabs[tempId + ''].disable)) &&
                (id = tempId);
        }
        return this.switchTab({ id, e });
    };
}
api.prototype.setData = (function () {
    const _validate = function (param) {
        if (!param)
            return false;
        const { openTabsId, activeTabId } = param;
        if (typeof activeTabId === 'undefined' && (typeof openTabsId === 'undefined'))
            return false;
        if (openTabsId && (openTabsId.constructor !== Array))
            throw 'passed openTabsId property in setData function must be an Array';
        if (activeTabId && (typeof activeTabId !== 'string'))
            throw 'type of the passed activeTabId property in setData function must be a string';
        return true;
    };
    return function (param) {
        if (!_validate(param))
            return this._helper.resolve(null);
        const { openTabsId, activeTabId } = param
            , currentActiveTabId = this.state.activeTabId
            , { events: { allTabsDidUpdate } } = this.getOptions();
        openTabsId && this._panelProxy.setRenderedPanels(openTabsId);
        (currentActiveTabId && activeTabId) && this.activedTabsHistory.addTab(currentActiveTabId);
        this._setData(param);
        return Promise.all([new Promise(resolve => {
            this.observable.createSubscriber(function (param) {
                resolve(param);
                this.unSubscribe(events.tabListDidUpdate);
            }).subscribe(events.tabListDidUpdate);
        }), new Promise(resolve => {
            this.observable.createSubscriber(function (param) {
                resolve(param);
                this.unSubscribe(events.panelListDidUpdate);
            }).subscribe(events.panelListDidUpdate);
        })])
            .then(([tabList, panelList]) => {
                allTabsDidUpdate.call(this, { ...tabList });
                return { ...tabList };
            }).catch(function (err) {
                throw err.message;
            });
    };
})();
api.prototype.openTab = function (id) {
    if (this.state.openTabsId.indexOf(id) >= 0)
        return this._helper.resolve(null);
    const { events: { afterOpenTab } } = this.getOptions();
    this._openTab(id);
    return Promise.all([new Promise(resolve => {
        this.observable.createSubscriber(function (param) {
            resolve(param);
            this.unSubscribe(events.tabDidMount);
        }).subscribe(events.tabDidMount);
    }), new Promise(resolve => {
        this.observable.createSubscriber(function (param) {
            resolve(param);
            this.unSubscribe(events.panelDidMount);
        }).subscribe(events.panelDidMount);
    })])
        .then(([tab, panel]) => {
            afterOpenTab.call(this, { ...tab });
            return { ...tab };
        }).catch(function (err) {
            throw err.message;
        });
};
api.prototype.addTab = function (tabObj) {
    const data = this.getOptions().data;
    data.allTabs.hasOwnProperty(tabObj.id) ||
        (data.allTabs[tabObj.id] = tabObj);
    return this;
};
api.prototype.closeTab = (function () {
    function _closeTab(id) {
        const { events: { afterCloseTab } } = this.getOptions();
        this._closeTab(id);
        return Promise.all([new (Promise)(resolve => {
            this.observable.createSubscriber(function (param) {
                resolve(param);
                this.unSubscribe(events.tabWillUnmount);
            }).subscribe(events.tabWillUnmount);
        }), new Promise(resolve => {
            this.observable.createSubscriber(function (param) {
                resolve(param);
                this.unSubscribe(events.panelWillUnmount);
            }).subscribe(events.panelWillUnmount);
        })])
            .then(([tab, panel]) => {
                afterCloseTab.call(this, { ...tab });
                return { ...tab };
            }).catch(function (err) {
                throw err.message;
            });
    }
    return function ({ id, e, switchBeforeClose = true }) {
        const { resolve } = this._helper;
        if (!this.isOpenTab(id))
            return resolve(null);
        if (!this.getOptions().events.beforeCloseTab({ id, e }))
            return resolve(null);
        debugger;
        this._panelProxy.removeRenderedPanel(id);
        if (switchBeforeClose && this.isActiveTab(id))
            return this._switchToUnknowTab({ e: e }).then(result => _closeTab.call(this, id)).catch(function (err) {
                throw err.message;
            });
        else
            return _closeTab.call(this, id);
    };
})();
api.prototype.forceUpdate = function () {
    const { events: { allTabsDidUpdate } } = this.getOptions();
    this._forceUpdate();
    return Promise.all([new Promise(resolve => {
        this.observable.createSubscriber(function () {
            resolve();
            this.unSubscribe(events.tabListDidUpdate);
        }).subscribe(events.tabListDidUpdate);
    }), new Promise(resolve => {
        this.observable.createSubscriber(function () {
            resolve();
            this.unSubscribe(events.panelListDidUpdate);
        }).subscribe(events.panelListDidUpdate);
    })])
        .then(([tabList, panelList]) => {
            allTabsDidUpdate.call(this);
            return;
        }).catch(function (err) {
            throw err.message;
        });
};
api.prototype.clearPanelsCache = function (panelId) {
    panelId ? this._panelProxy.removeRenderedPanel(panelId) :
        this._panelProxy.setRenderedPanels([this.state.activeTabId]);
    return this;
};
export default api;