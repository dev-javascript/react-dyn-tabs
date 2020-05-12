const _cloneObje = function (obj) { return JSON.parse(JSON.stringify(obj)); };
function optionManager(param = {}) {
    const { options } = param;
    this.currentOptions = {};
    this.initialOptions = {};
    options && this.setNewOptions(options);
};
optionManager.prototype.createOptions = function (options) {
    const defaultOptions = this.getDefaultOptions(), newAllTabs = {}, { data } = options, { allTabs } = data;
    allTabs.map(item => { newAllTabs[item.id] = item; });
    const newOptions = Object.assign(defaultOptions, _cloneObje(options));
    newOptions.data.allTabs = newAllTabs;
    return newOptions;
};
optionManager.prototype.reset = function () {
    this.currentOptions = this.getInitialOptionsCopy();
    return this;
};
optionManager.prototype.getActiveTab = function () {
    const { data, data: { activeTabId } } = this.currentOptions;
    let panelComponent = null;
    if (activeTabId >= 0) {
        if (!data.allTabs.hasOwnProperty(activeTabId))
            throw new Error('Invalid activeTabId! There is not any corresponding data for given activeTabId');
        panelComponent = data.allTabs[activeTabId].panelComponent;
    }
    return { activeTabId, panelComponent };
};
optionManager.prototype.getInitialOptionsCopy = function () { return _cloneObje(this.initialOptions); };
optionManager.prototype.getCurrentOptionsCopy = function () { return _cloneObje(this.currentOptions); };
optionManager.prototype.getMutableCurrentOptions = function () { return this.currentOptions; };
optionManager.prototype.setNewOptions = function (newOptions) {
    Object.keys(this.initialOptions).length ||
        (this.initialOptions = this.createOptions(newOptions));
    this.currentOptions = this.createOptions(newOptions);
    return this;
};
optionManager.prototype.getDefaultOptions = function () {
    return {};
};
export default optionManager;