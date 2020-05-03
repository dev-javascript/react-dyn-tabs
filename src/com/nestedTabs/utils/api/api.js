import { actions } from "../stateManagement";
const api = function ({ initialOptions }) {
    this.getInitialOptions = function () { return { ...initialOptions }; };
    this.options = initialOptions;
    this.state = {};
    this.dispatch = {};
};
api.prototype.openTab = function (tabId) {
    (this.state.openTabsId.indexOf(tabId) >= 0) ||
        this.dispatch({ type: actions.open, tabId });
    return this;
};
api.prototype.addTab = function (tabObj) {
    this.options.data.allTabs.hasOwnProperty(tabObj.id) || (this.options.data.allTabs[tabObj.id] = tabObj);
    return this;
};
api.prototype.activeTab = function (tabId) {
    (this.getData().activeTabId == tabId) ||
        this.dispatch({
            type: actions.active,
            tabId: tabId,
            addRenderedCom: () => this.options.renderedComponent.addById(tabId, this.options.data.allTabs[tabId].panelComponent),
        });
    return this;
};
api.prototype.reset = function () { this.options = this.initialOptions; };
api.prototype.getOptions = function () { return this.options; };
api.prototype.getData = function () { return this.state; };
export default api;
