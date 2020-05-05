
export default function (deps) {
    const { optionManager, renderedComponent } = deps;
    function internalApi() {
        this.dispatch = () => { };
        this.state = {};
        this.optionManager = optionManager;
        this.renderedComponent = renderedComponent;
    }
    internalApi.prototype.updateReducer = function (state, dispatch) {
        this.state = state;
        this.dispatch = dispatch;
    };
    return internalApi;
};