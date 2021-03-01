import Helper from '../helper.js';
const { throwMissingParam: missingParamEr, throwInvalidParam: invalidParamEr } = Helper;
export const apiConstructor = function (getDeps, param = { options: {} }) {
    param.options = param.options || {};
    const { optionManagerIns, helper, activedTabsHistoryIns } = getDeps.call(this, param.options);
    this.optionManager = optionManagerIns;
    this.helper = helper;
    this.activedTabsHistory = activedTabsHistoryIns;
    this._setUserProxy()._alterOnChangeCallback()._subscribeCallbacksOptions()._subscribeSelectedTabsHistory();
};
export const apiMethods = {
    _setUserProxy: function () {
        const userProxy = {};
        for (var prop in this)
            if (prop[0] !== '_') {
                const propValue = this[prop];
                if (typeof propValue === 'function') {
                    userProxy[prop] = propValue.bind(this);
                } else {
                    userProxy[prop] = propValue;
                }
            }
        this.userProxy = userProxy;
        return this;
    },
    _alterOnChangeCallback: function () {
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
    },
    _subscribeCallbacksOptions: function () {
        const op = this.getOptions();
        Object.keys(this._publishers).map(eventName => {
            this.on(eventName, param => {
                if (op.hasOwnProperty(eventName) && typeof op[eventName] === 'function')
                    op[eventName].call(this, param);
            });
        });
        return this;
    },
    _subscribeSelectedTabsHistory: function () {
        this.on('onChange', ({ isSwitched, oldState }) => {
            isSwitched && this.activedTabsHistory.add(oldState.selectedTabID);
        });
        return this;
    },
    getCopyPerviousData: function () { return this.helper.getCopyState(this._perviousState); },
    getOptions: function () { return this.optionManager.getMutableOptions(); },
    setOption: function (name = missingParamEr('setOption'), value = missingParamEr('setOption')) {
        if (name.toUpperCase() === ('SELECTEDTABID' || 'OPENTABIDS' || 'DATA'))
            return;
        this.getOptions()[name] = value;
    },
    getSetting: function () { return this.optionManager.setting; },
    getCopyData: function () { return this.helper.getCopyState(this._state); },
    getInitialState: function () {
        const { selectedTabID, openTabIDs } = this.getOptions();
        return { selectedTabID, openTabIDs };
    },
    isSelected: function (id = missingParamEr('isSelected')) { return this._state.selectedTabID == id; },
    isOpen: function (id = missingParamEr('isOpen')) { return this._state.openTabIDs.indexOf(id) >= 0; },
    eventHandlerFactory: function ({ e, id }) {
        const { beforeClose, beforeSelect } = this.getOptions(), el = e.target, parentEl = el.parentElement
            , { close, tab } = this.getSetting().cssClasses;
        if (el.className.includes(close) && parentEl && parentEl.lastChild && (parentEl.lastChild == el) && parentEl.className.includes(tab))
            beforeClose.call(this.userProxy, e, id) && this.close(id);
        else
            beforeSelect.call(this.userProxy, e, id) && this.select(id);
    },
    _getOnChangePromise: function () {
        return new (Promise)(resolve => { this.one('onChange', () => { resolve.call(this.userProxy); }); });
    },
    select: function (id = missingParamEr('select')) {
        this.trigger('beforeSwitchTab', id);
        const result = this._getOnChangePromise();
        this._select(id);
        return result;
    },
    _findTabIdForSwitching: (function () {
        const _findOpenedAndNoneDisableTabId = function (tabsIdArr, isRightToLeft) {
            return (this.helper.arrFilterUntilFirstValue(tabsIdArr, id => this.isOpen(id) && (!this.getTab(id).disable)
                && (!this.isSelected(id)), isRightToLeft) || '');
        }
            , _getPreSelectedTabId = function () {
                return _findOpenedAndNoneDisableTabId.call(this, [...this.activedTabsHistory.tabsId], true);
            }
            , _getPreSiblingTabId = function () {
                const data = this._state, arr = data.openTabIDs;
                return _findOpenedAndNoneDisableTabId.call(this, arr.slice(0, arr.indexOf(data.selectedTabID)), true);
            }
            , _getNextSiblingTabId = function () {
                const data = this._state, arr = data.openTabIDs;
                return _findOpenedAndNoneDisableTabId.call(this, arr.slice(arr.indexOf(data.selectedTabID) + 1));
            };
        return function () {
            let tabId = '';
            tabId = _getPreSelectedTabId.call(this);
            tabId = tabId || _getPreSiblingTabId.call(this);
            tabId = tabId || _getNextSiblingTabId.call(this);
            return tabId;
        };
    })(),
    open: function (tabObj = missingParamEr('open')) {
        const result = this._getOnChangePromise();
        this._open(tabObj.id);
        this._addTab(tabObj);
        return result;
    },
    __close: function (id) {
        const result = this._getOnChangePromise();
        this._close(id);
        this._removeTab(id);
        return result;
    },
    close: function (id = missingParamEr('close')) {
        if (this.isSelected(id)) {
            const _openTabsId = [...this._state.openTabIDs];
            _openTabsId.splice(_openTabsId.indexOf(id), 1);
            this.select(this._findTabIdForSwitching());
            return this.__close(id);
        }
        else
            return this.__close(id);
    },
    refresh: function () {
        const result = this._getOnChangePromise();
        this._refresh();
        return result;
    }
};
