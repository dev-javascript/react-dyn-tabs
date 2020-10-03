import BaseApi from './baseApi';
import Helper from '../helper.js';
const { throwMissingParam: throwEr } = Helper;
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
    const { onChange, onOpen, onSelect, onClose, onDestroy, onInit } = this.getOptions()
        , _pbs = this.publishers, api = this.userProxy, _pp = this._panelProxy;
    _pbs.onInit.subscribe(() => { onInit.call(api); });
    _pbs.onDestroy.subscribe(() => { onDestroy.call(api); });
    _pbs.beforeSwitchTab.subscribe((id) => { _pp.addRenderedPanel(id); });
    _pbs.onChange.subscribe(({ closedTabsId }) => { closedTabsId.map(id => { _pp.removeRenderedPanel(id); }); })
        .subscribe(({ isSwitched, oldState }) => { isSwitched && this.activedTabsHistory.addTab(oldState.activeTabId); })
        .subscribe(({ newState, oldState, closedTabsId, openedTabsId, isSwitched }) => {
            const currentSelectedTabId = newState.activeTabId
                , perviousSelectedTabId = oldState.activeTabId;
            openedTabsId.length && onOpen.call(api, openedTabsId);
            closedTabsId.length && onClose.call(api, closedTabsId);
            isSwitched && onSelect.call(api, { currentSelectedTabId, perviousSelectedTabId });
            onChange.call(api, { currentData: newState, perviousData: oldState });
        });
};
api.prototype.getCopyPerviousData = function () { return this.helper.getCopyState(this.perviousState); };
api.prototype.getOptions = function () { return this.optionManager.getMutableOptions(); };
api.prototype.getSetting = function () { return this.optionManager.setting; };
api.prototype.getCopyData = function () { return this.helper.getCopyState(this.state); };
api.prototype.getInitialState = function () {
    const { activeTabId, openTabsId } = this.getOptions();
    return { activeTabId, openTabsId };
};
api.prototype.getTabObj = function (tabId) {
    const tabs = this.getOptions().data;
    return tabs.hasOwnProperty(tabId) ? tabs[tabId] : null;
};
api.prototype._checkForExistingData = function (IDs) {
    IDs.map(id => {
        if (!this.getTabObj(id))
            throw `tab id can not be "${id}". there is not any tab object for it. you should call 
            addTab function before it.`;
    });
};
api.prototype.getPanel = function (id) { return this._panelProxy.getPanel(id, this.getOptions().data[id].panelComponent); };
api.prototype.getSelectedTabsHistory = function () { return this.activedTabsHistory.tabsId; };
api.prototype.isActiveTab = function (id) { return this.state.activeTabId == id; };
api.prototype.isOpenTab = function (id) { return this.state.openTabsId.indexOf(id) >= 0; };
api.prototype.eventHandlerFactory = function ({ e, id, type }) {
    const { beforeClose, beforeSelect } = this.getOptions();
    if (type === 'close')
        beforeClose.call(this.userProxy, e, id) && this.closeTab(id);
    else
        beforeSelect.call(this.userProxy, e, id) && this.switchTab(id);
};
api.prototype._getOnChangePromise = function () {
    return new (Promise)(resolve => { this.publishers.onChange.onceSubscribe(() => { resolve.call(this.userProxy); }); });
};
api.prototype.switchTab = (function () {
    function _validate(id) {
        if (!this.isOpenTab(id))
            throw `Can not select tab with "${id}" id. is not open. you should open it at first.`;
    }
    return function (id = throwEr('switchTab')) {
        this._checkForExistingData([id]);
        _validate.call(this, id);
        this.publishers.beforeSwitchTab.trigger(id);
        const result = this._getOnChangePromise();
        this._activeTab(id);
        return result;
    };
})();
api.prototype._findTabIdForSwitching = (function () {
    const _findOpenedAndNoneDisableTabId = function (tabsIdArr, isRightToLeft) {
        return this.helper.arrFilterUntilFirstValue(tabsIdArr, id =>
            this.isOpenTab(id) && (!this.getTabObj(id).disable) && (!this.isActiveTab(id)), isRightToLeft);
    }
        , _getPreSelectedTabId = function () {
            return _findOpenedAndNoneDisableTabId.call(this, [...this.getSelectedTabsHistory()], true);
        }
        , _getPreSiblingTabId = function () {
            const data = this.state, arr = data.openTabsId;
            return _findOpenedAndNoneDisableTabId.call(this, arr.slice(0, arr.indexOf(data.activeTabId)), true);
        }
        , _getNextSiblingTabId = function () {
            const data = this.state, arr = data.openTabsId;
            return _findOpenedAndNoneDisableTabId.call(this, arr.slice(arr.indexOf(data.activeTabId), arr.length - 1));
        };
    return function () {
        let tabId = null;
        tabId = _getPreSelectedTabId.call(this);
        tabId === null && (tabId = _getPreSiblingTabId.call(this));
        tabId === null && (tabId = _getNextSiblingTabId.call(this));
        return tabId;
    };
})();
api.prototype.setData = (function () {
    const _validate = function (param) {
        const { openTabsId, activeTabId } = param;
        if (typeof activeTabId === 'undefined' && (typeof openTabsId === 'undefined'))
            throw 'calling setData function with wrong parameters';
        if (openTabsId && (openTabsId.constructor !== Array))
            throw 'type of the openTabsId parameter for setData function must be an Array';
        if (activeTabId && (typeof activeTabId !== 'string'))
            throw 'type of the activeTabId parameter in setData function must be a string';
        this._checkForExistingData(openTabsId);
        if (openTabsId.indexOf(activeTabId) === -1)
            throw 'incorrect parameter with setData function. openTabsId must include activeTabId';
        return true;
    };
    return function (param = throwEr('setData')) {
        _validate.call(this, param);
        (this.state.activeTabId !== param.activeTabId) &&
            this.publishers.beforeSwitchTab.trigger(param.activeTabId);
        const result = this._getOnChangePromise();
        this._setData(param);
        return result;
    };
})();
api.prototype.openTab = function (id = throwEr('openTab')) {
    this._checkForExistingData([id]);
    const result = this._getOnChangePromise();
    this._openTab(id);
    return result;
};
api.prototype.addTab = function (tabObj) {
    const data = this.getOptions().data;
    data.hasOwnProperty(tabObj.id) || (data[tabObj.id] = tabObj);
    return this;
};
api.prototype.__closeTab = function (id) {
    const result = this._getOnChangePromise();
    this._closeTab(id);
    return result;
};
api.prototype.closeTab = function (id = throwEr('closeTab'), switchBeforeCloseSelectedTab = true) {
    this._checkForExistingData([id]);
    if (switchBeforeCloseSelectedTab && this.isActiveTab(id)) {
        const _openTabsId = [...this.state.openTabsId];
        _openTabsId.splice(_openTabsId.indexOf(id), 1);
        return this.setData({
            activeTabId: this._findTabIdForSwitching(),
            openTabsId: _openTabsId
        });
    }
    else
        return this.__closeTab(id);
};
api.prototype.forceUpdate = function () {
    const result = this._getOnChangePromise();
    this._forceUpdate();
    return result;
};
api.prototype.clearPanelsCache = function (panelId) {
    panelId ? this._panelProxy.removeRenderedPanel(panelId) :
        this._panelProxy.setRenderedPanels([this.state.activeTabId]);
    return this;
};
export default api;