import BaseApi from './baseApi';
import events from '../events';
const _resolve = result => Promise.resolve(result);
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, objDefineNoneEnumerableProps,
        activedTabsHistoryIns, observablePattern } = getDeps(param.options);
    BaseApi.call(this);
    objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
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
    const _switchTab = function (id) {
        const options = this.getMutableCurrentOptions();
        this.activedTabsHistory.addTab(this.state.activeTabId);
        this.panelProxy.addRenderedPanel(id);
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
                return _resolve(null);
            return _switchTab.call(this, id);
        };
    })();
    api.prototype._switchToUnknowTab = function ({ e }) {
        return this.switchToPreSelectedTab({ e })
            .then(result => result ? _resolve(result) : this.switchToPreSiblingTab({ e }))
            .then(result => result ? _resolve(result) : this.switchToNxtSiblingTab({ e }));
    };
    api.prototype.switchToNxtSiblingTab = function ({ e }) {
        const index = this.state.openTabsId.indexOf(this.state.activeTabId) + 1;
        return this.switchTab({ id: this.state.openTabsId[index], e });
    };
    api.prototype.switchToPreSiblingTab = function ({ e }) {
        const index = this.state.openTabsId.indexOf(this.state.activeTabId) - 1;
        return this.switchTab({ id: this.state.openTabsId[index], e });
    };
    api.prototype.switchToPreSelectedTab = function ({ e }) {
        let id;
        while (!id) {
            const tempId = this.activedTabsHistory.getTab();
            if (tempId == undefined)
                return _resolve(null);
            this.state.openTabsId.indexOf(tempId) >= 0 && (id = tempId);
        }
        return this.switchTab({ id, e });
    };
}
api.prototype.openAllTab = function () { };
api.prototype.openTab = function (id) {
    if (this.state.openTabsId.indexOf(id) >= 0)
        return null;
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
        const { id } = param;
        if (!this.isOpenTab(id))
            return _resolve(null);
        if (!this.getMutableCurrentOptions().events.beforeCloseTab(param))
            return _resolve(null);
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