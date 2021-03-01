import actions from '../stateManagement/actions';
function BaseApi(helper) {
    this.forceUpdateState = {};
    this._helper = helper;
    this._state = {};
    this.stateRef = {};
    this._perviousState = {};
    this._dispatch = () => { };
}
BaseApi.prototype.updateReducer = function (state, dispatch) {
    this.stateRef = state;
    this._perviousState = this._helper.getCopyState(this._state);
    this._state = this._helper.getCopyState(state);
    this._perviousState = this._perviousState.hasOwnProperty('openTabIDs') ? this._perviousState :
        this._helper.getCopyState(this._state);
    this._dispatch = dispatch;
};
BaseApi.prototype._select = function (tabId) { this._dispatch({ type: actions.active, tabId }); };
BaseApi.prototype._close = function (tabId) { this._dispatch({ type: actions.close, tabId }); };
BaseApi.prototype._open = function (tabId) { this._dispatch({ type: actions.open, tabId }); };
BaseApi.prototype._refresh = function () {
    this.forceUpdateState = {};
    this._dispatch({ type: actions.refresh });
};
export default BaseApi;