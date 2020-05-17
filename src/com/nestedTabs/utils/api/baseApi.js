function baseApi() {
    this.state = {};
    this.dispatch = () => { };
}
baseApi.prototype.updateReducer = function (state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
};
export default baseApi;