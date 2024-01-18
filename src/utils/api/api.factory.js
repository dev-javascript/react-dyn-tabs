import Helper from '../helper.js';
const {throwMissingParam: missingParamEr, isArray, thorwInvalidParam} = Helper;
export const apiConstructor = function (getDeps, param = {options: {}}, modules = [], Components) {
  const {optionsManager, helper, activedTabsHistory, tablistRef, contexts} = getDeps.call(this, param.options);
  helper.setNoneEnumProps(this, {optionsManager, tablistRef, helper, activedTabsHistory, userProxy: {}, contexts});
  this._setUserProxy()
    ._subscribeOnReadyEvent()
    ._createReadyFunction()
    ._subscribeSelectedTabsHistory()
    ._subscribeCallbacksOptions();
  modules.forEach((module) => module(this, contexts, Components));
};
const _apiProps = {
  _setUserProxy: function () {
    const userProxy = {};
    for (const prop in this) {
      if (prop[0] !== '_' && prop !== 'constructor') {
        (function (that) {
          const propValue = that[prop];
          if (typeof propValue === 'function') {
            userProxy[prop] = function () {
              const result = propValue.apply(that, arguments);
              return result === that ? userProxy : result;
            };
          } else {
            userProxy[prop] = propValue;
          }
        })(this);
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
    this.on('onChange', ({currentData, previousData, closedTabIDs}) => {
      for (let i = 0, l = closedTabIDs.length; i < l; i++) {
        this.activedTabsHistory.remove(closedTabIDs[i]);
      }
      const isSwitched = previousData.selectedTabID !== currentData.selectedTabID;
      if (isSwitched && this.isOpen(previousData.selectedTabID) && !this.isSelected(previousData.selectedTabID))
        this.activedTabsHistory.add(previousData.selectedTabID);
    });
    return this;
  },
  _subscribeCallbacksOptions: function () {
    const op = this.optionsManager.options;
    Object.keys(this._publishers).forEach((eventName) => {
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
    this.optionsManager.setOption(name, value);
    return this;
  },
  getPreviousData: function () {
    return this.helper.getCopyState(this.previousState);
  },
  getCopyPerviousData: function () {
    return this.getPreviousData();
  },
  getData: function () {
    return this.helper.getCopyState(this.stateRef);
  },
  getCopyData: function () {
    return this.getData();
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
  _getPreSelectedTabId: function () {
    const selectedTabHistory = [...this.activedTabsHistory.tabsId];
    let tabID = '';
    while (!tabID && selectedTabHistory.length) {
      const _tabID = selectedTabHistory.pop();
      if (_tabID) {
        const _tabData = this.getTab(_tabID);
        if (_tabData && !_tabData.disable && this.isOpen(_tabID) && !this.isSelected(_tabID)) tabID = _tabID;
      }
    }
    return tabID;
  },
  _getPreSiblingTabId: function () {
    const {selectedTabID, openTabIDs} = this.stateRef;
    const isRightToLeft = true;
    const arr = openTabIDs.slice(0, openTabIDs.indexOf(selectedTabID));
    return this.helper.filterArrayUntilFirstValue(arr, (id) => !this.getTab(id).disable, isRightToLeft);
  },
  _getNextSiblingTabId: function () {
    const {selectedTabID, openTabIDs} = this.stateRef;
    const isRightToLeft = false;
    const arr = openTabIDs.slice(openTabIDs.indexOf(selectedTabID) + 1);
    return this.helper.filterArrayUntilFirstValue(arr, (id) => !this.getTab(id).disable, isRightToLeft);
  },
  _findTabIdForSwitching: function () {
    let tabId = '';
    tabId = this._getPreSelectedTabId();
    tabId = tabId || this._getPreSiblingTabId();
    tabId = tabId || this._getNextSiblingTabId();
    return tabId || '';
  },
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
  sort: function (tabIDs = missingParamEr('sort')) {
    if (!isArray(tabIDs)) {
      thorwInvalidParam('sort');
    }
    const result = this._getFlushEffectsPromise();
    this._sort(tabIDs);
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
      this.trigger('onChange', this.userProxy, () => {
        return [
          {
            currentData: this.helper.getCopyState(newState),
            previousData: this.helper.getCopyState(oldState),
            perviousData: this.helper.getCopyState(oldState),
            closedTabIDs: closedTabIDs.slice(),
            openedTabIDs: openedTabIDs.slice(),
          },
        ];
      });
      openedTabIDs.length &&
        this.trigger('onOpen', this.userProxy, () => {
          return [openedTabIDs.slice()];
        });
      closedTabIDs.length &&
        this.trigger('onClose', this.userProxy, () => {
          return [closedTabIDs.slice()];
        });
      if (isSwitched) {
        if (newState.selectedTabID && this.activedTabsHistory.tabsId.indexOf(newState.selectedTabID) === -1) {
          this.trigger('onFirstSelect', this.userProxy, () => {
            return [
              {
                currentSelectedTabId: newState.selectedTabID,
                previousSelectedTabId: oldState.selectedTabID,
              },
            ];
          });
        }
        this.trigger('onSelect', this.userProxy, () => {
          return [
            {
              currentSelectedTabId: newState.selectedTabID,
              previousSelectedTabId: oldState.selectedTabID,
              perviousSelectedTabId: oldState.selectedTabID,
            },
          ];
        });
      }
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
  getSetting: function (settingName) {
    const st = this.optionsManager.setting;
    if (st.hasOwnProperty(settingName)) {
      if (typeof st[settingName] === 'function') {
        return st[settingName].apply(st, Array.prototype.slice.call(settingName, 1));
      }
      return st[settingName];
    }
  },
});
export const apiProps = _apiProps;
