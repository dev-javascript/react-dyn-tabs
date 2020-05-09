export default function (deps) {
    const { internalApiInstance, actions } = deps;
    const externalApi = function () {
        this.openTab = function (tabId) {
            (this.state.openTabsId.indexOf(tabId) >= 0) ||
                this.dispatch({ type: actions.open, tabId });
            return this;
        };
        this.addTab = function (tabObj) {
            const data = this.getMutableCurrentOptions().data;
            data.allTabs.hasOwnProperty(tabObj.id) ||
                (data.allTabs[tabObj.id] = tabObj);
            return this;
        };
        this.getMutableCurrentOptions = () => this.optionManager.getMutableCurrentOptions();
        this.activeTab = function (tabId) {
            (this.state.activeTabId == tabId) ||
                this.dispatch({
                    type: actions.active,
                    tabId: tabId,
                    addRenderedCom: () =>
                        this.renderedComponent.addById(tabId, this.getMutableCurrentOptions().data.allTabs[tabId].panelComponent),
                });
            return this;
        };
        this.reset = function () { this.reset(); };
        this.getOptions = function () { return this.getCurrentOptionsCopy(); };
        this.getData = function () { return this.state; };
    };
    externalApi.prototype = Object.create(internalApiInstance);
    externalApi.prototype.constructor = externalApi;
    return externalApi;
};
