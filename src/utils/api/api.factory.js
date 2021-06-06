import Helper from '../helper.js';
const {throwMissingParam: missingParamEr} = Helper;
export const apiConstructor = function (getDeps, param = {options: {}}) {
  const {optionsManager, helper, activedTabsHistory} = getDeps.call(this, param.options);
  helper.setNoneEnumProps(this, {optionsManager, helper, activedTabsHistory, userProxy: {}});
  this._setUserProxy()
    ._subscribeOnReadyEvent()
    ._createReadyFunction()
    ._subscribeSelectedTabsHistory()
    ._subscribeCallbacksOptions();
};
const _apiProps = {
  _setUserProxy: function () {
    const userProxy = {},
      that = this;
    for (var prop in this)
      if (prop[0] !== '_' && prop !== 'constructor') {
        const propValue = this[prop];
        if (typeof propValue === 'function') {
          userProxy[prop] = function () {
            const result = propValue.apply(that, arguments);
            return result === that ? userProxy : result;
          };
        } else {
          userProxy[prop] = propValue;
        }
      }
    this.userProxy = userProxy;
    return this;
  },
  _subscribeOnReadyEvent: function () {
    this.one('_onReady', () => {
      this._isReady = true;
    });
    return this;
  },
  _createReadyFunction: function () {
    let ready = (fn) => {
      if (this._isReady === true) {
        fn.call(this.userProxy, this.userProxy);
      } else {
        this.one('_onReady', () => {
          fn.call(this.userProxy, this.userProxy);
        });
      }
    };
    ready = ready.bind(this);
    // make ready function object for supporting deprecated api
    Object.assign(ready, this.userProxy);
    this.helper.setNoneEnumProps(this, {ready});
    return this;
  },
  _subscribeSelectedTabsHistory: function () {
    this.on('onChange', ({currentData, perviousData}) => {
      const isSwitched = perviousData.selectedTabID !== currentData.selectedTabID;
      isSwitched && this.activedTabsHistory.add(perviousData.selectedTabID);
    });
    return this;
  },
  _subscribeCallbacksOptions: function () {
    const op = this.optionsManager.options;
    Object.keys(this._publishers).map((eventName) => {
      if (eventName[0] !== '_')
        this.on(eventName, function () {
          op[eventName].apply(this, arguments);
        });
    });
    return this;
  },
  getOption: function (name) {
    return this.optionsManager.getOption(name);
  },
  setOption: function (name, value) {
    return this.optionsManager.setOption(name, value);
  },
  getCopyPerviousData: function () {
    return this.helper.getCopyState(this._perviousState);
  },
  getCopyData: function () {
    return this.helper.getCopyState(this.stateRef);
  },
  isSelected: function (id = missingParamEr('isSelected')) {
    return this.stateRef.selectedTabID == id;
  },
  isOpen: function (id = missingParamEr('isOpen')) {
    return this.stateRef.openTabIDs.indexOf(id) >= 0;
  },
  _getFlushEffectsPromise: function () {
    return new Promise((resolve) => {
      this.one('_onFlushEffects', function () {
        resolve.apply(this, arguments);
      });
    });
  },
  select: function (id = missingParamEr('select')) {
    if (id) id = id + ''; //make sure id is string
    const result = this._getFlushEffectsPromise();
    this._select(id);
    return result;
  },
  _findTabIdForSwitching: (function () {
    const _findOpenedAndNoneDisableTabId = function (tabsIdArr, isRightToLeft) {
        return (
          this.helper.arrFilterUntilFirstValue(
            tabsIdArr,
            (id) => this.isOpen(id) && !this.getTab(id).disable && !this.isSelected(id),
            isRightToLeft,
          ) || ''
        );
      },
      _getPreSelectedTabId = function () {
        return _findOpenedAndNoneDisableTabId.call(this, [...this.activedTabsHistory.tabsId], true);
      },
      _getPreSiblingTabId = function () {
        const data = this.stateRef,
          arr = data.openTabIDs;
        return _findOpenedAndNoneDisableTabId.call(this, arr.slice(0, arr.indexOf(data.selectedTabID)), true);
      },
      _getNextSiblingTabId = function () {
        const data = this.stateRef,
          arr = data.openTabIDs;
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
  setTab: function (id, newData = {}) {
    this.optionsManager.validateObjectiveTabData(newData).validatePanelComponent(newData);
    this._setTab(id, newData);
    return this;
  },
  open: function (tabObj = missingParamEr('open')) {
    const newTabObj = this.optionsManager.validateTabData(tabObj);
    const result = this._getFlushEffectsPromise();
    this._addTab(newTabObj);
    this._open(newTabObj.id);
    return result;
  },
  __close: function (id) {
    const result = this._getFlushEffectsPromise();
    this._close(id);
    this._removeTab(id);
    return result;
  },
  close: function (id = missingParamEr('close'), switching = true) {
    if (id) id = id + ''; //make sure id is string
    if (switching && this.isOpen(id) && this.isSelected(id)) {
      const _openTabsId = [...this.stateRef.openTabIDs];
      _openTabsId.splice(_openTabsId.indexOf(id), 1);
      this.select(this._findTabIdForSwitching());
      return this.__close(id);
    } else return this.__close(id);
  },
  refresh: function () {
    const result = this._getFlushEffectsPromise();
    this._refresh();
    return result;
  },
};
Helper.setNoneEnumProps(_apiProps, {
  onChange: function ({newState, oldState, closedTabIDs, openedTabIDs, isSwitched}) {
    if (isSwitched || openedTabIDs.length || closedTabIDs.length) {
      this.trigger('onChange', this.userProxy, {
        currentData: {...newState},
        perviousData: {...oldState},
        closedTabIDs,
        openedTabIDs,
      });
      openedTabIDs.length && this.trigger('onOpen', this.userProxy, openedTabIDs);
      closedTabIDs.length && this.trigger('onClose', this.userProxy, closedTabIDs);
      isSwitched &&
        this.trigger('onSelect', this.userProxy, {
          currentSelectedTabId: newState.selectedTabID,
          perviousSelectedTabId: oldState.selectedTabID,
        });
    }
    return this;
  },
  eventHandlerFactory: function ({e, id}) {
    const el = e.target,
      parentEl = el.parentElement,
      {closeClass, tabClass} = this.optionsManager.setting;
    if (
      el.className.includes(closeClass) &&
      parentEl &&
      parentEl.lastChild &&
      parentEl.lastChild == el &&
      parentEl.className.includes(tabClass)
    ) {
      this.getOption('beforeClose').call(this.userProxy, e, id) !== false && this.close(id, true);
    } else {
      this.getOption('beforeSelect').call(this.userProxy, e, id) !== false && this.select(id);
    }
  },
});
export const apiProps = _apiProps;
