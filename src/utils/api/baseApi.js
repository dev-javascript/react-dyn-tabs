import actions from '../stateManagement/actions';
import Helper from '../helper.js';
function BaseApi(helper) {
    this._helper = helper;
    this._state = null;// it will be updated after each render
    this._initialState = null;
    this._perviousState = null;// it is a pervious value of this._state
    this._dispatch = null;
    helper.setNoneEnumProps(this, {
        forceUpdateState: {},
        stateRef: {}// have a same reference with state . It will be updated in each execution of useDynamicTabs.js
    });
}
BaseApi.prototype._select = function (tabId) { this._dispatch({ type: actions.active, tabId }); };
BaseApi.prototype._close = function (tabId) { this._dispatch({ type: actions.close, tabId }); };
BaseApi.prototype._open = function (tabId) { this._dispatch({ type: actions.open, tabId }); };
BaseApi.prototype._refresh = function () {
    this.forceUpdateState = {};
    this._dispatch({ type: actions.refresh });
};
Helper.setNoneEnumProps(BaseApi.prototype, {
    updateStateRef: function (state) { this.stateRef = state; return this; },
    updateDispatchRef: function (dispatch) { this._dispatch = dispatch; return this; },
    updateState: function (state) {
        this._perviousState = this._helper.getCopyState(this._state || state);
        this._state = this._helper.getCopyState(state);
        return this;
    }
});
export default BaseApi;