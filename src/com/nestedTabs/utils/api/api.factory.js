import BaseApi from './baseApi';
import events from '../events';
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, helper,
        activedTabsHistoryIns, observablePattern } = getDeps(param.options);
    BaseApi.call(this);
    helper.objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        _helper: helper,
        panelProxy: panelProxyIns,
        activedTabsHistory: activedTabsHistoryIns,
        observable: observablePattern
    });
};
api.prototype = Object.create(BaseApi.prototype);
api.prototype.constructor = api;
api.prototype.getMutableCurrentOptions = function () { return this.optionManager.getMutableCurrentOptions(); };
api.prototype.reset = function () { this.optionManager.reset(); return this; };
api.prototype.getData = function () { return { ...this.state }; };
api.prototype.getPanel = function (id) {
    return this.panelProxy.getPanel(id
        , this.optionManager.getMutableCurrentOptions().data.allTabs[id].panelComponent);
};
api.prototype.getActivedTabsHistory = function () { return this.activedTabsHistory.tabsId; };
api.prototype.isActiveTab = function (id) { return this.state.activeTabId == id; };
api.prototype.isOpenTab = function (id) { return this.state.openTabsId.indexOf(id) >= 0; };
api.prototype._beforeSwitchTab = function ({ id, e }) { return this.getMutableCurrentOptions().events.beforeSwitchTab({ id, e }); };
api.prototype.eventHandlerFactory = function ({ e, id }) {
    //test mutablitiy of events
    const { events, switchTabEventMode, closeTabEventMode } = this.getMutableCurrentOptions()
        , { type } = e;
    events[`on${type}Tab`].call(this, { e, id });
    e.target.className.includes(this.optionManager.defaultClasses.closeIcon) ?
        (type === closeTabEventMode && this.closeTab({ e, id }, true))
        : (type === switchTabEventMode && this.switchTab({ e, id }));
};
{
    const _switchToSiblingTab = function ({ e }, traverseToNext) {
        let index;
        const increaseOrDecrease = traverseToNext ? (value => value + 1) : (value => value - 1)
            , openTabsId = this.state.openTabsId
            , _length = openTabsId.length
            , tabs = this.getMutableCurrentOptions().data.allTabs
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
        const options = this.getMutableCurrentOptions(), activeTabId = this.state.activeTabId;
        activeTabId && this.activedTabsHistory.addTab(activeTabId);
        id && this.panelProxy.addRenderedPanel(id);
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
    api.prototype.deactiveTab = function (e) {
        const id = this.state.activeTabId, { resolve } = this._helper;
        if (!id || !this._beforeSwitchTab({ id, e }))
            return resolve(null);
        return _switchTab.call(this, '');
    };
    api.prototype._switchToUnknowTab = function ({ e }) {
        return this.switchToPreSelectedTab({ e })
            .then(result => result ? this._helper.resolve(result) : this.switchToPreSiblingTab({ e }))
            .then(result => result ? this._helper.resolve(result) : this.switchToNxtSiblingTab({ e }))
            .then(result => result ? this._helper.resolve(result) : this.deactiveTab({ e }));
    };
    api.prototype.switchToNxtSiblingTab = function ({ e }) { return _switchToSiblingTab.call(this, { e }, true); };
    api.prototype.switchToPreSiblingTab = function ({ e }) { return _switchToSiblingTab.call(this, { e }, false); };
    api.prototype.switchToPreSelectedTab = function ({ e }) {
        let id;
        const tabs = this.getMutableCurrentOptions().data.allTabs
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
api.prototype.openAllTab = function () { };
api.prototype.openTab = function (id) {
    if (this.state.openTabsId.indexOf(id) >= 0)
        return this._helper.resolve(null);
    const { events: { afterOpenTab } } = this.getMutableCurrentOptions();
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
    const data = this.getMutableCurrentOptions().data;
    data.allTabs.hasOwnProperty(tabObj.id) ||
        (data.allTabs[tabObj.id] = tabObj);
    return this;
};
api.prototype.closeTab = (function () {
    function _closeTab(id) {
        const { events: { afterCloseTab } } = this.getMutableCurrentOptions();
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
    return function (param, switchBeforeClose = true) {
        const { id } = param, { resolve } = this._helper;
        if (!this.isOpenTab(id))
            return resolve(null);
        if (!this.getMutableCurrentOptions().events.beforeCloseTab(param))
            return resolve(null);
        if (switchBeforeClose && this.isActiveTab(id))
            return this._switchToUnknowTab({ e: param.e }).then(result => _closeTab.call(this, id)).catch(function (err) {
                throw err.message;
            });
        else
            return _closeTab.call(this, id);
    };
})();
api.prototype.forceUpdate = function () {
    const { events: { allTabsDidUpdate } } = this.getMutableCurrentOptions();
    this._forceUpdate();
    return Promise.all([new Promise(resolve => {
        this.observable.createSubscriber(function () {
            resolve();
            this.unSubscribe(events.tabListUpdate);
        }).subscribe(events.tabListUpdate);
    }), new Promise(resolve => {
        this.observable.createSubscriber(function () {
            resolve();
            this.unSubscribe(events.panelListUpdate);
        }).subscribe(events.panelListUpdate);
    })])
        .then(([tabList, panelList]) => {
            allTabsDidUpdate.call(this);
            return;
        }).catch(function (err) {
            throw err.message;
        });
};
export default api;