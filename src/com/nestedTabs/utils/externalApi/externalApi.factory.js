
export default function (deps) {
    const { internalApi } = deps;
    const externalApi = function () {
        this.openTab = function (tabId) {
            (this.state.openTabsId.indexOf(tabId) >= 0) ||
                this.dispatch({ type: actions.open, tabId });
            return this;
        };
        this.addTab = function (tabObj) {
            this.options.data.allTabs.hasOwnProperty(tabObj.id) || (this.options.data.allTabs[tabObj.id] = tabObj);
            return this;
        };
        this.activeTab = function (tabId) {
            (this.getData().activeTabId == tabId) ||
                this.dispatch({
                    type: actions.active,
                    tabId: tabId,
                    addRenderedCom: () => this.options.renderedComponent.addById(tabId, this.options.data.allTabs[tabId].panelComponent),
                });
            return this;
        };
        this.reset = function () { this.options = this.initialOptions; };
        this.getOptions = function () { return this.options; };
        this.getData = function () { return this.state; };
        // const api = function ({ initialOptions }) {
        //     this.getInitialOptions = function () { return { ...initialOptions }; };
        //     this.options = initialOptions;
        //     this.state = {};
        //     this.dispatch = {};
        // };
    };
    externalApi.prototype = Object.create(internalApi);
    externalApi.prototype.constructor = externalApi;
    return externalApi;
}