function internalApi(deps) {
    const { optionManager, renderedComponent } = deps;
    this.dispatch = () => { };
    this.state = {};
    this.optionManager = optionManager;
    this.renderedComponent = renderedComponent;
}
internalApi.prototype.updateReducer = function (state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
};
export default internalApi;