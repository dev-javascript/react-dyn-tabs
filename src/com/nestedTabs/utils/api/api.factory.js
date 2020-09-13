import BaseApi from './baseApi';
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, helper, getUserProxy,
        activedTabsHistoryIns, publisherIns } = getDeps(param.options);
    BaseApi.call(this, helper);
    helper.objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        _helper: helper,
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
    const { events: _ev } = this.getOptions(), _pubs = this.publishers, _usrp = this.userProxy, _pp = this._panelProxy;
    _pubs.rootComponentDidMountPublisher.subscribe(() => { _ev.onLoad(_usrp); });
    _pubs.rootComponentWillUnmountPublisher.subscribe(() => { _ev.onDestroy(); });
    _pubs.beforeSwitchTabPublisher.subscribe(({ switchTabsId }) => { _pp.addRenderedPanel(switchTabsId.newSelectedTabId) });
    _pubs.onSwitchTabPublisher.subscribe(({ switchTabsId }) => { this.activedTabsHistory.addTab(switchTabsId.oldSelectedTabId); })
        .subscribe(({ triggerOnSwitchTab, switchTabsId }) => { triggerOnSwitchTab && _ev.onSwitchTab(switchTabsId, _usrp); });
    _pubs.onCloseTabPublisher.subscribe(({ id }) => { _pp.removeRenderedPanel(id); })
        .subscribe(({ triggerOnCloseTab, id }) => { triggerOnCloseTab && _ev.onCloseTab(id, _usrp); });
    _pubs.onOpenTabPublisher.subscribe(({ triggerOnOpenTab, id }) => { triggerOnOpenTab && _ev.onOpenTab(id, _usrp); });
    _pubs.beforeSetDataPublisher.subscribe(({ isSwitched, switchTabsId }) => {
        isSwitched && _pubs.beforeSwitchTabPublisher.trigger({ switchTabsId });
    });
    _pubs.onSetDataPublisher.subscribe(param => {
        const { isSwitched, switchTabsId, openTabsId, closeTabsId, triggerOnOpenTab, triggerOnCloseTab, triggerOnSwitchTab } = param;
        closeTabsId.map(id => { _pubs.onCloseTabPublisher.trigger({ triggerOnCloseTab, id }); });
        openTabsId.map(id => { _pubs.onOpenTabPublisher.trigger({ triggerOnOpenTab, id }); });
        isSwitched && _pubs.onSwitchTabPublisher.trigger({ triggerOnSwitchTab, switchTabsId });
    });
};
api.prototype.getOptions = function () { return this.optionManager.getMutableOptions(); };
api.prototype.getCopyData = function () { return this._helper.getCopyState(this.state); };
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
api.prototype._switchToSiblingTab = function (triggerOnSwitchTab, traverseToNext) {
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
    return this.switchTab(this.state.openTabsId[index], triggerOnSwitchTab);
};
api.prototype._switchTab = function (id, triggerOnSwitchTab) {
    const _pubs = this.publishers, switchTabsId = { newSelectedTabId: id, oldSelectedTabId: this.state.activeTabId };
    _pubs.beforeSwitchTabPublisher.trigger({ switchTabsId });
    const result = new (Promise)(resolve => {
        _pubs.rootComponentDidUpdatePublisher.onceSubscribe(() => {
            _pubs.onSwitchTabPublisher.trigger({ switchTabsId, triggerOnSwitchTab });
            resolve({ switchTabsId }, this.userProxy);
        });
    });
    this._activeTab(id);
    return result;
};
api.prototype.switchTab = function (id, triggerOnSwitchTab) {
    if (this.isActiveTab(id)) { return this._helper.resolve(null) };
    if (!this.isOpenTab(id)) { return this._helper.resolve(null) };
    return this._switchTab(id, triggerOnSwitchTab);
};
api.prototype.deselectTab = function (triggerOnSwitchTab) {
    if (!this.state.activeTabId)
        return this._helper.resolve(null);
    return this._switchTab('', triggerOnSwitchTab);
};
api.prototype._switchToUnknowTab = function (triggerOnSwitchTab) {
    return this.switchToPreSelectedTab(triggerOnSwitchTab)
        .then(result => result ? this._helper.resolve(result) : this.switchToPreSiblingTab(triggerOnSwitchTab))
        .then(result => result ? this._helper.resolve(result) : this.switchToNxtSiblingTab(triggerOnSwitchTab))
        .then(result => result ? this._helper.resolve(result) : this.deselectTab(triggerOnSwitchTab));
};
api.prototype.switchToNxtSiblingTab = function (triggerOnSwitchTab) { return this._switchToSiblingTab(triggerOnSwitchTab, true); };
api.prototype.switchToPreSiblingTab = function (triggerOnSwitchTab) { return this._switchToSiblingTab(triggerOnSwitchTab, false); };
api.prototype.switchToPreSelectedTab = function (triggerOnSwitchTab) {
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
    return this.switchTab(id, triggerOnSwitchTab);
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
        const _h = this._helper, _rslv = _h.resolve;
        if (!_validate(param)) { return _rslv(null); }
        const _pubs = this.publishers, isSwitched = this.state.activeTabId != param.activeTabId
            , switchTabsId = { oldSelectedTabId: this.state.activeTabId, newSelectedTabId: param.activeTabId }
            , [closeTabsId, openTabsId] = this._helper.getArraysDiff(this.state.openTabsId, param.openTabsId)
            , { triggerOnCloseTab, triggerOnSwitchTab, triggerOnOpenTab } = param;
        if (!isSwitched && !closeTabsId.length && !openTabsId.length) { return _rslv(null); }
        _pubs.beforeSetDataPublisher.trigger({ switchTabsId, isSwitched });
        const result = new (Promise)(resolve => {
            _pubs.rootComponentDidUpdatePublisher.onceSubscribe(() => {
                _pubs.onSetDataPublisher.trigger({
                    triggerOnCloseTab, triggerOnSwitchTab, triggerOnOpenTab, switchTabsId, isSwitched, closeTabsId, openTabsId
                });
                resolve({ switchTabsId, isSwitched, closeTabsId }, this.userProxy);
            });
        });
        this._setData(param);
        return result;
    };
})();
api.prototype.openTab = function (id, triggerOnOpenTab) {
    if (this.state.openTabsId.indexOf(id) >= 0) { return this._helper.resolve(null); }
    const result = new Promise(resolve => {
        this.publishers.rootComponentDidUpdatePublisher.onceSubscribe(() => {
            this.publishers.onOpenTabPublisher.trigger({ id, triggerOnOpenTab });
            resolve(this.userProxy);
        });
    });
    this._openTab(id);
    return result;
};
api.prototype.addTab = function (tabObj) {
    const data = this.getOptions().data;
    data.allTabs.hasOwnProperty(tabObj.id) ||
        (data.allTabs[tabObj.id] = tabObj);
    return this;
};
api.prototype.__closeTab = function (id, triggerOnCloseTab) {
    const _pubs = this.publishers, result = new (Promise)(reslove => {
        _pubs.rootComponentDidUpdatePublisher.onceSubscribe(() => {
            _pubs.onCloseTabPublisher.trigger({ id, triggerOnCloseTab });
            reslove(this.userProxy);
        });
    });
    this._closeTab(id);
    return result;
};
api.prototype.closeTab = function (id, switchBeforeClose, triggerOnCloseTab, triggerOnSwitchTab) {
    if (!this.isOpenTab(id)) { return this._helper.resolve(null); }
    if (switchBeforeClose && this.isActiveTab(id))
        return this._switchToUnknowTab(triggerOnSwitchTab).then(result => this.__closeTab(id, triggerOnCloseTab)).catch(function (err) {
            throw err.message;
        });
    else
        return this.__closeTab(id, triggerOnCloseTab);
};
api.prototype.forceUpdate = function () {
    const result = new (Promise)(resolve => {
        this.publishers.rootComponentDidUpdatePublisher.onceSubscribe(() => { resolve(this.userProxy); });
    });
    this._forceUpdate();
    return result;
};
api.prototype.clearPanelsCache = function (panelId) {
    panelId ? this._panelProxy.removeRenderedPanel(panelId) :
        this._panelProxy.setRenderedPanels([this.state.activeTabId]);
    return this;
};
export default api;