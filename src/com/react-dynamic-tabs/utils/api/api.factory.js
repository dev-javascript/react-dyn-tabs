import BaseApi from './baseApi';
import Helper from '../helper.js';
const { throwMissingParam: missingParamEr, throwInvalidParam: invalidParamEr } = Helper;
const api = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, panelProxyIns, helper, getUserProxy,
        activedTabsHistoryIns, pub_sub_Instance } = getDeps(param.options);
    BaseApi.call(this, helper);
    helper.objDefineNoneEnumerableProps(this, {
        optionManager: optionManagerIns,
        helper,
        _panelProxy: panelProxyIns,
        activedTabsHistory: activedTabsHistoryIns,
        userProxy: getUserProxy(this)
    });
    this.pub_sub = pub_sub_Instance;
    this._alterOnChangeCallback()._subscribeCallbacksOptions()._subscribeSelectedTabsHistory();
};
api.prototype = Object.create(BaseApi.prototype);
api.prototype.constructor = api;
api.prototype._alterOnChangeCallback = function () {
    const op = this.getOptions();
    op.onChange = op.onChange || (() => { });
    const oldOnchange = op.onChange;
    op.onChange = function ({ newState, oldState, closedTabsId, openedTabsId, isSwitched }) {
        oldOnchange.call(this, { currentData: newState, perviousData: oldState });
        openedTabsId.length && this.trigger('onOpen', openedTabsId, this);
        closedTabsId.length && this.trigger('onClose', closedTabsId, this);
        isSwitched && this.trigger('onSelect', {
            currentSelectedTabId: newState.selectedTabID,
            perviousSelectedTabId: oldState.selectedTabID
        }, this);
    };
    return this;
};
api.prototype._subscribeSelectedTabsHistory = function () {
    this.pub_sub.subscribe('onChange', ({ isSwitched, oldState }) => {
        isSwitched && this.activedTabsHistory.add(oldState.selectedTabID);
    });
    return this;
};
api.prototype._subscribeCallbacksOptions = function () {
    const op = this.getOptions();
    Object.keys(this.pub_sub.publishers).map(publisher => {
        this.pub_sub.subscribe(publisher, param => {
            if (op.hasOwnProperty(publisher) && typeof op[publisher] === 'function')
                op[publisher].call(this, param);
        });
    });
    return this;
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
api.prototype.eventHandlerFactory = function ({ e, id }) {
    const { beforeClose, beforeSelect } = this.getOptions(), el = e.target, parentEl = el.parentElement
        , { close, tab } = this.getSetting().cssClasses;
    if (el.className.includes(close) && parentEl && parentEl.lastChild && (parentEl.lastChild == el) && parentEl.className.includes(tab))
        beforeClose.call(this.userProxy, e, id) && this.close(id);
    else
        beforeSelect.call(this.userProxy, e, id) && this.select(id);
};
api.prototype._getOnChangePromise = function () {
    return new (Promise)(resolve => { this.pub_sub.oneSubscribe('onChange', () => { resolve.call(this.userProxy); }); });
};
api.prototype.select = (function () {
    function _validate(id) {
        id = id || '';
        id && this._checkForExistingData([id]);
        if (id && !this.isOpen(id))
            throw `Can not select tab with "${id}" id. is not open. you should open it at first.`;
    }
    return function (id = missingParamEr('select')) {
        _validate.call(this, id);
        this.pub_sub.trigger('beforeSwitchTab', id);
        const result = this._getOnChangePromise();
        this._select(id);
        return result;
    };
})();
api.prototype._findTabIdForSwitching = (function () {
    const _findOpenedAndNoneDisableTabId = function (tabsIdArr, isRightToLeft) {
        return (this.helper.arrFilterUntilFirstValue(tabsIdArr, id => this.isOpen(id) && (!this.getTabObj(id).disable)
            && (!this.isSelected(id)), isRightToLeft) || '');
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
            return _findOpenedAndNoneDisableTabId.call(this, arr.slice(arr.indexOf(data.selectedTabID) + 1));
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
            this.pub_sub.trigger('beforeSwitchTab', param.selectedTabID);
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
    const _validate = function (obj) {
        this.helper.isObj(obj) || invalidParamEr('add');
        obj.hasOwnProperty('id') || invalidParamEr('add');
    }
        , _setDefaultOp = function (obj) { obj = Object.assign({}, this.getSetting().defaultTabObj, obj); };
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
api.prototype.on = function (eventName, handler) {
    this.pub_sub.subscribe(eventName, handler);
    return this;
};
api.prototype.off = function (eventName, handler) {
    this.pub_sub.unSubscribe(eventName, handler);
    return this;
};
api.prototype.one = function (eventName, handler) {
    this.pub_sub.oneSubscribe(eventName, handler);
    return this;
};
api.prototype.trigger = function (eventName, handler) {
    this.pub_sub.trigger(eventName, handler);
    return this;
};
export default api;