import BaseApi from './baseApi';
const _resolve = result => Promise.resolve(result);
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, objDefineNoneEnumerableProps,
        activedTabsHistoryIns } = getDeps(param.options);
    BaseApi.call(this);
    this.openTab = function (id) {
        if (this.state.openTabsId.indexOf(id) >= 0)
            return null;
        const { events: { afterOpenTab } } = this.getMutableCurrentOptions()
            , tabPromise = new Promise(resolve => {
                this.stackedEvent.afterOpenTab.push(resolve);
            })
            , panelPromise = new Promise(resolve => {
                this.stackedEvent.afterOpenPanel.push(resolve);
            });
        this._openTab(id);
        return Promise.all([tabPromise, panelPromise])
            .then(([tab, panel]) => {
                afterOpenTab.call(this, { ...tab });
                return { ...tab };
            }).catch(function (err) {
                throw err.message;
            });
    };
    this.addTab = function (tabObj) {
        const data = this.getMutableCurrentOptions().data;
        data.allTabs.hasOwnProperty(tabObj.id) ||
            (data.allTabs[tabObj.id] = tabObj);
        return this;
    };
    this.getMutableCurrentOptions = () => this.optionManager.getMutableCurrentOptions();
    this.reset = function () { this.optionManager.reset(); return this; };
    this.getData = function () { return { ...this.state }; };
    objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        panelProxy: panelProxyIns,
        activedTabsHistory: activedTabsHistoryIns,
        stackedEvent: (function () {
            const createObj = () => ({
                _value: [],
                push: function (value) { return this._value.push(value); },
                flush: function (param) { while (this._value.length) this._value.pop()(param); }
            });
            return {
                afterSwitchTab: createObj(),
                afterSwitchPanel: createObj(),
                afterCloseTab: createObj(),
                afterClosePanel: createObj(),
                afterOpenTab: createObj(),
                afterOpenPanel: createObj(),
            };
        })()
    });
};
api.prototype = Object.create(BaseApi.prototype);
api.prototype.constructor = api;
api.prototype.getPanel = function (id) {
    return this.panelProxy.getPanel(id
        , this.optionManager.getMutableCurrentOptions().data.allTabs[id].panelComponent);
};
api.prototype.tabWillUnmount = function (param) {
    this.stackedEvent.afterCloseTab.flush(param);
};
api.prototype.panelWillUnmount = function (param) {
    this.stackedEvent.afterClosePanel.flush(param);
};
api.prototype.tabDidMount = function (param) {
    this.stackedEvent.afterOpenTab.flush(param);
};
api.prototype.panelDidMount = function (param) {
    this.stackedEvent.afterOpenPanel.flush(param);
};
api.prototype.tabDidUpdate = function (param) { };
api.prototype.panelDidUpdate = function (param) { };
api.prototype.tabListDidUpdateByActiveTabId = function ({ oldActiveId, newActiveId, isFirstCall }) {
    isFirstCall || this.stackedEvent.afterSwitchTab.flush({ oldActiveId, newActiveId });
};
api.prototype.panelListDidUpdateByActiveTabId = function ({ oldActiveId, newActiveId, isFirstCall }) {
    isFirstCall || this.stackedEvent.afterSwitchPanel.flush({ oldActiveId, newActiveId });
};
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
        const options = this.getMutableCurrentOptions()
            , tabPromise = new Promise((resolve, resject) => {
                this.stackedEvent.afterSwitchTab.push(resolve);
            })
            , panelPromise = new Promise((resolve, resject) => {
                this.stackedEvent.afterSwitchPanel.push(resolve);
            });
        this.activedTabsHistory.add(this.state.activeTabId);
        this.panelProxy.addRenderedPanel(id);
        this._activeTab(id);
        return Promise.all([tabPromise, panelPromise])
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
            const tempId = this.activedTabsHistory.get();
            if (tempId == undefined)
                return _resolve(null);
            this.state.openTabsId.indexOf(tempId) >= 0 && (id = tempId);
        }
        return this.switchTab({ id, e });
    };
}
api.prototype.closeTab = (function () {
    function _close(id) {
        const { events: { afterCloseTab } } = this.getMutableCurrentOptions()
            , tabPromise = new Promise(resolve => {
                this.stackedEvent.afterCloseTab.push(resolve);
            })
            , panelPromise = new Promise(resolve => {
                this.stackedEvent.afterClosePanel.push(resolve);
            });
        this._closeTab(id);
        return Promise.all([tabPromise, panelPromise])
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
            return this._switchToUnknowTab({ e: param.e }).then(result => _close.call(this, id)).catch(function (err) {
                throw err.message;
            });
        else
            return _close.call(this, id);
    };
})();
api.prototype.getActivedTabsHistory = function () { return this.activedTabsHistory.tabsId; };
api.prototype.isActiveTab = function (id) { return this.state.activeTabId == id; };
api.prototype.isOpenTab = function (id) { return this.state.openTabsId.indexOf(id) >= 0; };
api.prototype._beforeSwitchTab = function ({ id, e }) { return this.getMutableCurrentOptions().events.beforeSwitchTab({ id, e }); };
export default api;