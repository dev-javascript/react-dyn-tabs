import actions from '../stateManagement/actions';
function BaseApi(helper) {
    this.forceUpdateState = {};
    this._helper = helper;
    this.state = {};
    this.perviousState = {};
    this._dispatch = () => { };
}
BaseApi.prototype.updateReducer = function (state, dispatch) {
    this.perviousState = this._helper.getCopyState(this.state);
    this.state = this._helper.getCopyState(state);
    this.perviousState = this.perviousState.hasOwnProperty('openTabsId') ? this.perviousState :
        this._helper.getCopyState(this.state)
    this._dispatch = dispatch;
};
BaseApi.prototype._activeTab = function (tabId) { this._dispatch({ type: actions.active, tabId }); };
BaseApi.prototype._closeTab = function (tabId) { this._dispatch({ type: actions.close, tabId }); };
BaseApi.prototype._openTab = function (tabId) { this._dispatch({ type: actions.open, tabId }); };
BaseApi.prototype._forceUpdate = function () {
    this.forceUpdateState = {};
    this._dispatch({ type: actions.forceUpdate });
};
BaseApi.prototype._setData = function (newStateData) {
    const dispatchParam = Object.assign({ type: actions.setData }, newStateData);
    this._dispatch(dispatchParam);
};
export default BaseApi;