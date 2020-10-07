import BaseApi from './baseApi';
import Helper from '../helper.js';
const { throwMissingParam: missingParamEr, throwInvalidParam: invalidParamEr } = Helper;
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
        .subscribe(({ isSwitched, oldState }) => { isSwitched && this.activedTabsHistory.add(oldState.selectedTabID); })
        .subscribe(({ newState, oldState, closedTabsId, openedTabsId, isSwitched }) => {
            const currentSelectedTabId = newState.selectedTabID
                , perviousSelectedTabId = oldState.selectedTabID;
            openedTabsId.length && onOpen.call(api, openedTabsId);
            closedTabsId.length && onClose.call(api, closedTabsId);
            isSwitched && onSelect.call(api, { currentSelectedTabId, perviousSelectedTabId });
            onChange.call(api, { currentData: newState, perviousData: oldState });
        });
};
api.prototype.getCopyPerviousData = function () { return this.helper.getCopyState(this.perviousState); };
api.prototype.getOptions = function () { return this.optionManager.getMutableOptions(); };
api.prototype.setOption = function (name = missingParamEr('setOption'), value = missingParamEr('setOption')) {
    if (name.toUpperCase() === ('SELECTEDTABID' || 'OPENTABIDS' || 'DATA'))
        return;
    this.getOptions()[name] = value;
};
api.prototype.getSetting = function () { return this.optionManager.setting; };
api.prototype.getCopyData = function () { return this.helper.getCopyState(this.state); };
api.prototype.getInitialState = function () {
    const { selectedTabID, openTabIDs } = this.getOptions();
    return { selectedTabID, openTabIDs };
};
api.prototype.getTabObj = function (tabId = missingParamEr('getTabObj')) {
    const tabs = this.getOptions().data;
    return tabs.hasOwnProperty(tabId) ? tabs[tabId] : null;
};
api.prototype._checkForExistingData = function (IDs) {
    IDs.map(id => {
        if (!this.getTabObj(id))
            throw `tab id can not be "${id}". there is not any tab object for it. you should call 
            add function before it.`;
    });
};
api.prototype.getPanel = function (id) { return this._panelProxy.getPanel(id, this.getTabObj(id).panelComponent); };
api.prototype.isSelected = function (id = missingParamEr('isSelected')) { return this.state.selectedTabID == id; };
api.prototype.isOpen = function (id = missingParamEr('isOpen')) { return this.state.openTabIDs.indexOf(id) >= 0; };
api.prototype.eventHandlerFactory = function ({ e, id, type }) {
    const { beforeClose, beforeSelect } = this.getOptions();
    if (type === 'close')
        beforeClose.call(this.userProxy, e, id) && this.close(id);
    else
        beforeSelect.call(this.userProxy, e, id) && this.select(id);
};
api.prototype._getOnChangePromise = function () {
    return new (Promise)(resolve => { this.publishers.onChange.onceSubscribe(() => { resolve.call(this.userProxy); }); });
};
api.prototype.select = (function () {
    function _validate(id) {
        if (!this.isOpen(id))
            throw `Can not select tab with "${id}" id. is not open. you should open it at first.`;
    }
    return function (id = missingParamEr('select')) {
        this._checkForExistingData([id]);
        _validate.call(this, id);
        this.publishers.beforeSwitchTab.trigger(id);
        const result = this._getOnChangePromise();
        this._select(id);
        return result;
    };
})();
api.prototype._findTabIdForSwitching = (function () {
    const _findOpenedAndNoneDisableTabId = function (tabsIdArr, isRightToLeft) {
        return (this.helper.arrFilterUntilFirstValue(tabsIdArr, id =>
            this.isOpen(id) && (!this.getTabObj(id).disable) && (!this.isSelected(id)), isRightToLeft)
            || '');
    }
        , _getPreSelectedTabId = function () {
            return _findOpenedAndNoneDisableTabId.call(this, [...this.activedTabsHistory.tabsId], true);
        }
        , _getPreSiblingTabId = function () {
            const data = this.state, arr = data.openTabIDs;
            return _findOpenedAndNoneDisableTabId.call(this, arr.slice(0, arr.indexOf(data.selectedTabID)), true);
        }
        , _getNextSiblingTabId = function () {
            const data = this.state, arr = data.openTabIDs;
            return _findOpenedAndNoneDisableTabId.call(this, arr.slice(arr.indexOf(data.selectedTabID), arr.length - 1));
        };
    return function () {
        let tabId = '';
        tabId = _getPreSelectedTabId.call(this);
        tabId = tabId || _getPreSiblingTabId.call(this);
        tabId = tabId || _getNextSiblingTabId.call(this);
        return tabId;
    };
})();
api.prototype.setData = (function () {
    const _validate = function (param) {
        const { openTabIDs, selectedTabID } = param;
        if (typeof selectedTabID === 'undefined' && (typeof openTabIDs === 'undefined'))
            throw 'calling setData function with wrong parameters';
        if (openTabIDs && (openTabIDs.constructor !== Array))
            throw 'type of the openTabIDs parameter for setData function must be an Array';
        if (typeof selectedTabID !== 'string')
            throw 'type of the selectedTabID parameter in setData function must be a string';
        this._checkForExistingData(openTabIDs);
        if (selectedTabID && openTabIDs.indexOf(selectedTabID) === -1)
            throw 'incorrect parameter with setData function. openTabIDs must include selectedTabID';
        return true;
    };
    return function (param = missingParamEr('setData')) {
        _validate.call(this, param);
        (this.state.selectedTabID !== param.selectedTabID) &&
            this.publishers.beforeSwitchTab.trigger(param.selectedTabID);
        const result = this._getOnChangePromise();
        this._setData(param);
        return result;
    };
})();
api.prototype.open = function (id = missingParamEr('open')) {
    this._checkForExistingData([id]);
    const result = this._getOnChangePromise();
    this._open(id);
    return result;
};
api.prototype.add = (function () {
    const _validate = function (obj) { this.helper.isObj(obj) || invalidParamEr('add'); }
        , _setDefaultOp = function (obj) { obj = Object.assign(this.getSetting().getDefaultTabObj(), obj); };
    return function (tabObj = missingParamEr('add')) {
        _validate.call(this, tabObj);
        _setDefaultOp.call(this, tabObj);
        this.getTabObj(tabObj.id) || (this.getOptions().data[tabObj.id] = tabObj);
        return this;
    };
})();
api.prototype.__close = function (id) {
    const result = this._getOnChangePromise();
    this._close(id);
    return result;
};
api.prototype.close = function (id = missingParamEr('close'), switchBeforeCloseSelectedTab = true) {
    this._checkForExistingData([id]);
    if (switchBeforeCloseSelectedTab && this.isSelected(id)) {
        const _openTabsId = [...this.state.openTabIDs];
        _openTabsId.splice(_openTabsId.indexOf(id), 1);
        return this.setData({
            selectedTabID: this._findTabIdForSwitching(),
            openTabIDs: _openTabsId
        });
    }
    else
        return this.__close(id);
};
api.prototype.reload = function () {
    const result = this._getOnChangePromise();
    this._reload();
    return result;
};
api.prototype.clearPanelCache = function (panelId) {
    panelId ? this._panelProxy.removeRenderedPanel(panelId) :
        this._panelProxy.setRenderedPanels([this.state.selectedTabID]);
    return this;
};
export default api;