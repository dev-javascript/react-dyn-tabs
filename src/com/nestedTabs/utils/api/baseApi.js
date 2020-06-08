import { objDefineNoneEnumerableProps } from '../helper';
function baseApi() {
    objDefineNoneEnumerableProps(this, {
        state: { value: {}, writable: true },
        dispatch: { value: () => { }, writable: true }
    });
}
baseApi.prototype.updateReducer = function (state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
};
export default baseApi;