import BaseApi from './baseApi';
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, helper, getUserProxy,
        activedTabsHistoryIns, publisherIns } = getDeps(param.options);
    BaseApi.call(this, helper);
    helper.objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        helper,
        _panelProxy: panelProxyIns,
        activedTabsHistory: activedTabsHistoryIns,
        publishers: publisherIns,
        userProxy: getUserProxy(this)
    });
    this._createSubscribers();
};
api.prototype = Object.create(BaseApi.prototype);
api.prototype.constructor = api;
api.prototype._createSubscribers = function () {
    const { events: _ev } = this.getOptions(), _pbs = this.publishers, _api = this.userProxy, _pp = this._panelProxy;
    _pbs.onInit.subscribe(() => { _ev.onLoad({ api: _api }); });
    _pbs.onDestroy.subscribe(() => { _ev.onDestroy(); });
    _pbs.beforeSwitchTab.subscribe((id) => { _pp.addRenderedPanel(id); });
    _pbs.onChange.subscribe(({ closedTabsId }) => { closedTabsId.map(id => { _pp.removeRenderedPanel(id); }); })
        .subscribe(({ isSwitched, oldState }) => { isSwitched && this.activedTabsHistory.addTab(oldState.activeTabId); })
        .subscribe(({ newState, oldState, closedTabsId, openedTabsId, isSwitched }) => {
            let selectedTabId = null, deselectedTabId = null;
            if (isSwitched) {
                selectedTabId = newState.activeTabId;
                deselectedTabId = oldState.activeTabId;
            }
            _ev.onChange({ newState, oldState, changes: { closedTabsId, openedTabsId, selectedTabId, deselectedTabId }, api: _api });
        });
};
api.prototype.getCopyPerviousData = function () { return this.helper.getCopyState(this.perviousState); };
api.prototype.getOptions = function () { return this.optionManager.getMutableOptions(); };
api.prototype.getCopyData = function () { return this.helper.getCopyState(this.state); };
api.prototype.getInitialState = function () {
    const { data: { activeTabId, openTabsId } } = this.getOptions();
    return { activeTabId, openTabsId };
};
api.prototype.getTabObj = function (tabId) {
    const tabs = this.getOptions().data.allTabs;
    return tabs.hasOwnProperty(tabId) ? tabs[tabId] : null;
};
api.prototype.getPanel = function (id) { return this._panelProxy.getPanel(id, this.getOptions().data.allTabs[id].panelComponent); };
api.prototype.getSelectedTabsHistory = function () { return this.activedTabsHistory.tabsId; };
api.prototype.isActiveTab = function (id) { return this.state.activeTabId == id; };
api.prototype.isOpenTab = function (id) { return this.state.openTabsId.indexOf(id) >= 0; };
api.prototype.eventHandlerFactory = function ({ e, id }) {
    const { events, switchTabEventMode, closeTabEventMode } = this.getOptions(), { type } = e
        , allowContinue = events[`on${type}Tab`](e, id, this.userProxy);
    e.target.className.includes(this.optionManager.setting.defaultCssClasses.closeIcon) ?
        ((type === closeTabEventMode && allowContinue) && this.closeTab(id, true, true, true))
        : ((type === switchTabEventMode && allowContinue) && this.switchTab(id, true));
};
api.prototype._switchToSiblingTab = function (traverseToNext) {
    let index;
    const increaseOrDecrease = traverseToNext ? (value => value + 1) : (value => value - 1)
        , openTabsId = this.state.openTabsId
        , _length = openTabsId.length
        , tabs = this.getOptions().data.allTabs
        , { resolve, checkArrIndex } = this.helper;
    index = increaseOrDecrease(openTabsId.indexOf(this.state.activeTabId));
    if (!checkArrIndex(index, _length))
        return resolve(null);
    while (tabs[openTabsId[index]].disable) {
        index = increaseOrDecrease(index);
        if (!checkArrIndex(index, _length))
            return resolve(null);
    }
    return this.switchTab(this.state.openTabsId[index]);
};
api.prototype._getOnChangeDone = function () {
    return new (Promise)(resolve => { this.publishers.onChange.onceSubscribe(() => { resolve(this.userProxy); }); });
};
api.prototype._switchTab = function (id) {
    this.publishers.beforeSwitchTab.trigger(id);
    const result = this._getOnChangeDone();
    this._activeTab(id);
    return result;
};
api.prototype.switchTab = function (id) {
    if (this.isActiveTab(id)) { return this.helper.resolve(null) };
    if (!this.isOpenTab(id)) { return this.helper.resolve(null) };
    return this._switchTab(id);
};
api.prototype.deselectTab = function () {
    if (!this.state.activeTabId)
        return this.helper.resolve(null);
    return this._switchTab('');
};
api.prototype._switchToUnknowTab = function () {
    return this.switchToPreSelectedTab()
        .then(result => result ? this.helper.resolve(result) : this.switchToPreSiblingTab())
        .then(result => result ? this.helper.resolve(result) : this.switchToNxtSiblingTab())
        .then(result => result ? this.helper.resolve(result) : this.deselectTab());
};
api.prototype.switchToNxtSiblingTab = function () { return this._switchToSiblingTab(true); };
api.prototype.switchToPreSiblingTab = function () { return this._switchToSiblingTab(false); };
api.prototype.switchToPreSelectedTab = function () {
    let id;
    const tabs = this.getOptions().data.allTabs
        , openTabsId = this.state.openTabsId
    while (!id) {
        const tempId = this.activedTabsHistory.getTab();
        if (tempId == undefined)//if activedTabsHistory array length is 0
            return this.helper.resolve(null);
        ((openTabsId.indexOf(tempId) >= 0) && (!tabs[tempId + ''].disable)) &&
            (id = tempId);
    }
    return this.switchTab(id);
};
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
        if (!_validate(param)) { return this.helper.resolve(null); }
        const isSwitched = this.state.activeTabId !== param.activeTabId
        if (!isSwitched && !this.helper.compareArrays(param.openTabsId, this.state.openTabsId))
            return this.helper.resolve(null);
        isSwitched && this.publishers.beforeSwitchTab.trigger(param.activeTabId);
        const result = this._getOnChangeDone();
        this._setData(param);
        return result;
    };
})();
api.prototype.openTab = function (id) {
    if (this.state.openTabsId.indexOf(id) >= 0) { return this.helper.resolve(null); }
    const result = this._getOnChangeDone();
    this._openTab(id);
    return result;
};
api.prototype.addTab = function (tabObj) {
    const data = this.getOptions().data;
    data.allTabs.hasOwnProperty(tabObj.id) ||
        (data.allTabs[tabObj.id] = tabObj);
    return this;
};
api.prototype.__closeTab = function (id) {
    const result = this._getOnChangeDone();
    this._closeTab(id);
    return result;
};
api.prototype.closeTab = function (id, switchBeforeClose) {
    if (!this.isOpenTab(id)) { return this.helper.resolve(null); }
    if (switchBeforeClose && this.isActiveTab(id))
        return this._switchToUnknowTab().then(result => this.__closeTab(id)).catch(function (err) {
            throw err.message;
        });
    else
        return this.__closeTab(id);
};
api.prototype.forceUpdate = function () {
    const result = this._getOnChangeDone();
    this._forceUpdate();
    return result;
};
api.prototype.clearPanelsCache = function (panelId) {
    panelId ? this._panelProxy.removeRenderedPanel(panelId) :
        this._panelProxy.setRenderedPanels([this.state.activeTabId]);
    return this;
};
export default api;