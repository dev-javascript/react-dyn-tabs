const createOptions;
function optionManager(deps) {
    this.CurrentOptions = {};
    this.initialOptions = {};
    createOptions = deps.createOptions || (() => { });
};
optionManager.prototype.reset = function () {
    this.CurrentOptions = this.getInitialOptionsCopy();
    return this;
};
optionManager.prototype.getInitialOptionsCopy = function () { return Object.assign({}, this.initialOptions) };
optionManager.prototype.getCurrentOptionsCopy = function () { return Object.assign({}, this.CurrentOptions); };
optionManager.prototype.getMutableCurrentOptions = function () { return this.CurrentOptions; };
optionManager.prototype.setNewOptions = (function () {
    let firstExecuted = false;
    return function (newOptions) {
        (!firstExecuted && !Object.keys(this.initialOptions).length)
            && (this.initialOptions = createOptions(this.getDefaultOptions(), newOptions));
        firstExecuted = true;
        this.CurrentOptions = createOptions(this.getDefaultOptions(), newOptions);
        return this;
    };
})();
optionManager.prototype.getDefaultOptions = function () {
    return {};
};
export default optionManager;