import actions from '../stateManagement/actions';
function BaseApi() {
    this.forceUpdateState = {};
    Object.defineProperties(this, {
        state: { value: {}, writable: true },
        _dispatch: { value: () => { }, writable: true }
    });
}
BaseApi.prototype.updateReducer = function (state, dispatch) {
    this.state = state;
    this._dispatch = dispatch;
};
BaseApi.prototype._activeTab = function (tabId) {
    this._dispatch({
        type: actions.active,
        tabId
    });
};
BaseApi.prototype._closeTab = function (tabId) {
    this._dispatch({
        type: actions.close,
        tabId
    });
};
BaseApi.prototype._openTab = function (tabId) {
    this._dispatch({
        type: actions.open,
        tabId
    });
};
BaseApi.prototype._forceUpdate = function () {
    this.forceUpdateState = {};
    this._dispatch({ type: actions.forceUpdate });
};
export default BaseApi;