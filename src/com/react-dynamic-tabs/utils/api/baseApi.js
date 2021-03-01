import actions from '../stateManagement/actions';
import Helper from '../helper.js';
function BaseApi(helper) {
    this._helper = helper;
    this._state = {};
    this._perviousState = {};
    this._dispatch = () => { };
    helper.setNoneEnumProps(this, {
        forceUpdateState: {},
        stateRef: {}
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
    updateReducer: function (state, dispatch) {
        this.stateRef = state;
        this._perviousState = this._helper.getCopyState(this._state);
        this._state = this._helper.getCopyState(state);
        this._perviousState = this._perviousState.hasOwnProperty('openTabIDs') ? this._perviousState :
            this._helper.getCopyState(this._state);
        this._dispatch = dispatch;
    }
});
export default BaseApi;