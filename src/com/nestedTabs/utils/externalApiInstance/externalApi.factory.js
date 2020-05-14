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
            const { events: { afterActiveTab } } = this.getMutableCurrentOptions();
            if (this.state.activeTabId == tabId)
                return new Promise((resolve, reject) => reject(`tab ${tabId} is already active`));
            const tabPromise = new Promise((resolve, resject) => {
                this.stackedEvent.afterActiveTab.push(resolve);
            });
            const panelPromise = new Promise((resolve, resject) => {
                this.stackedEvent.afterActivePanel.push(resolve);
            });
            this.dispatch({
                type: actions.active,
                tabId: tabId,
                addRenderedCom: () =>
                    this.renderedComponent.addById(tabId, this.getMutableCurrentOptions().data.allTabs[tabId].panelComponent),
            });
            return Promise.all([tabPromise, panelPromise])
                .then(([tabId, panelId]) => {
                    afterActiveTab({ tabId, panelId });
                    return Promise.resolve({ tabId, panelId });
                });
        };
        this.reset = function () { this.reset(); };
        this.getOptions = function () { return this.getCurrentOptionsCopy(); };
        this.getData = function () { return this.state; };
    };
    externalApi.prototype = Object.create(internalApiInstance);
    externalApi.prototype.constructor = externalApi;
    externalApi.prototype.stackedEvent = {
        afterActiveTab: [],
        afterActivePanel: [],
        afterCloseTab: [],
        afterOpenTab: []
    };
    externalApi.prototype.activeTabEventHandler = function ({ e, tabId }) {
        const { activeTabEventMode, events } = this.getMutableCurrentOptions(), { type } = e;
        events[`on${type}Tab`](e, tabId);
        ((type === activeTabEventMode) && events.beforeActiveTab(e, tabId))
            && this.activeTab(tabId);
    };
    return externalApi;
};
