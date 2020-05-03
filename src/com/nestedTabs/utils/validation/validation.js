function validation(deps, options) {
    this.deps = deps;
    this.options = options;
}
validation.prototype.validate = function () {
    const { data } = this.options;
    return this.setAllTabs(data)
        .getRenderComponent()
        .checkActiveTabId(data)
        .options;
};
validation.prototype.setAllTabs = function (data) {
    const newAllTabs = {};
    let { allTabs } = data;
    allTabs.map(item => {
        newAllTabs[item.id] = item;
    });
    data.allTabs = newAllTabs;
    return this;
};
validation.prototype.getRenderComponent = function () {
    this.options.renderedComponent = this.deps.renderedComponent;
    return this;
};
validation.prototype.checkActiveTabId = function (data) {
    const { allTabs, activeTabId } = data;
    activeTabId && this.options.renderedComponent
        .addById(activeTabId, allTabs[activeTabId].panelComponent);
    return this;
};
export default validation;