import actions from '../stateManagement/actions';
import Helper from '../helper.js';
export default Helper.module(
  function ({helper, initialState}) {
    this._helper = helper;
    this._dispatch = null;
    this._setFlushState = null;
    this._isReady = false;
    helper.setNoneEnumProps(this, {
      state: this._helper.getCopyState(initialState), // it will be updated after each render
      forceUpdateState: {},
      previousState: this._helper.getCopyState(initialState), // it is a previous value of this.state
      stateRef: {}, // have a same reference with state . It will be updated in each execution of useDynamicTabs.js
    });
  },
  {
    _select: function (tabId) {
      this._dispatch({type: actions.active, tabId});
      this.__flushEffects();
    },
    _close: function (tabId) {
      this._dispatch({type: actions.close, tabId});
      this.__flushEffects();
    },
    _open: function (tabId) {
      this._dispatch({type: actions.open, tabId});
      this.__flushEffects();
    },
    _refresh: function () {
      this.forceUpdateState = {};
      this._dispatch({type: actions.refresh});
      this.__flushEffects();
    },
    _sort: function (tabId) {
      this._dispatch({type: actions.sort, tabId});
      this.__flushEffects();
    },
    __flushEffects: function () {
      this._setFlushState({});
    },
  },
  {
    updateStateRef: function (state, dispatch) {
      this.stateRef = state;
      this._dispatch = dispatch;
      return this;
    },
    updateState: function (state) {
      this.previousState = this._helper.getCopyState(this.state);
      this.state = this._helper.getCopyState(state);
      return this;
    },
    updateFlushState: function (setFlushState) {
      this._setFlushState = setFlushState;
      return this;
    },
  },
);
