const createDescriptor = value => ({ writable: true, configurable: false, enumerable: false, value: value });
export default function (deps) {
    const { baseApiInstance, actions, optionManagerInstance, renderedComponentInstance } = deps;
    const api = function () {
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
                return new Promise(resolve => resolve({ tabId: `tab_${tabId}`, panelId: `panel_${tabId}` }));
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
                    afterActiveTab({ tabId: `tab_${tabId}`, panelId: `panel_${tabId}` });
                    return { tabId: `tab_${tabId}`, panelId: `panel_${tabId}` };
                }).catch(function (err) {
                    throw err.message;
                });;
        };
        this.reset = function () { this.reset(); };
        this.getOptions = function () { return this.getCurrentOptionsCopy(); };
        this.getData = function () { return { ...this.state }; };
        Object.defineProperties(this, {
            state: createDescriptor({ openTabsId: [], activeTabId: '' }),
            dispatch: createDescriptor(() => { }),
            optionManager: createDescriptor(optionManagerInstance),
            renderedComponent: createDescriptor(renderedComponentInstance),
            stackedEvent: createDescriptor({
                afterActiveTab: [],
                afterActivePanel: [],
                afterCloseTab: [],
                afterOpenTab: []
            })
        });
    };
    api.prototype = Object.create(baseApiInstance);
    api.prototype.constructor = api;
    api.prototype.activeTabEventHandler = function ({ e, tabId }) {
        const { activeTabEventMode, events } = this.getMutableCurrentOptions(), { type } = e;
        events[`on${type}Tab`](e, tabId);
        ((type === activeTabEventMode) && events.beforeActiveTab(e, tabId))
            && this.activeTab(tabId);
    };
    return api;
};
