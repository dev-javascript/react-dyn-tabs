import actions from '../stateManagement/actions';
import Helper from '../helper.js';
function BaseApi({helper, initialState}) {
  this._helper = helper;
  this._state = this._helper.getCopyState(initialState); // it will be updated after each render
  this._dispatch = null;
  this._setFlushState = null;
  this._isReady = false;
  helper.setNoneEnumProps(this, {
    forceUpdateState: {},
    previousState: this._helper.getCopyState(initialState), // it is a previous value of this._state
    stateRef: {}, // have a same reference with state . It will be updated in each execution of useDynamicTabs.js
  });
}
BaseApi.prototype._select = function (tabId) {
  this._dispatch({type: actions.active, tabId});
  this.__flushEffects();
};
BaseApi.prototype._close = function (tabId) {
  this._dispatch({type: actions.close, tabId});
  this.__flushEffects();
};
BaseApi.prototype._open = function (tabId) {
  this._dispatch({type: actions.open, tabId});
  this.__flushEffects();
};
BaseApi.prototype._refresh = function () {
  this.forceUpdateState = {};
  this._dispatch({type: actions.refresh});
  this.__flushEffects();
};
BaseApi.prototype.__flushEffects = function () {
  this._setFlushState({});
};
Helper.setNoneEnumProps(BaseApi.prototype, {
  updateStateRef: function (state, dispatch) {
    this.stateRef = state;
    this._dispatch = dispatch;
    return this;
  },
  updateState: function (state) {
    this.previousState = this._helper.getCopyState(this._state);
    this._state = this._helper.getCopyState(state);
    return this;
  },
  updateFlushState: function (setFlushState) {
    this._setFlushState = setFlushState;
    return this;
  },
});
export default BaseApi;
