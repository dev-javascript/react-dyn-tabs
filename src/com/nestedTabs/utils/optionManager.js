const createOptions = function (defaultOptions, options) {
    const newAllTabs = {}, { data } = options, { allTabs } = data;
    allTabs.map(item => { newAllTabs[item.id] = item; });
    data.allTabs = newAllTabs;
    return Object.assign(defaultOptions, options);
};
function optionManager(options) {
    this.CurrentOptions = {};
    this.initialOptions = {};
    options && this.setNewOptions(options);
};
optionManager.prototype.reset = function () {
    this.CurrentOptions = this.getInitialOptionsCopy();
    return this;
};
optionManager.prototype.getInitialOptionsCopy = function () { return Object.assign({}, this.initialOptions) };
optionManager.prototype.getCurrentOptionsCopy = function () { return Object.assign({}, this.CurrentOptions); };
optionManager.prototype.getMutableCurrentOptions = function () { return this.CurrentOptions; };
optionManager.prototype.setNewOptions = function (newOptions) {
    Object.keys(this.initialOptions).length ||
        (this.initialOptions = createOptions(this.getDefaultOptions(), newOptions));
    firstExecuted = true;
    this.CurrentOptions = createOptions(this.getDefaultOptions(), newOptions);
    return this;
};
optionManager.prototype.getDefaultOptions = function () {
    return {};
};
export default optionManager;