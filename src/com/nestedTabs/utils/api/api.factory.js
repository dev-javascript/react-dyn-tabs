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
            const { events: { afterSwitchTab } } = this.getMutableCurrentOptions();
            if (this.state.activeTabId == tabId)
                return new Promise(resolve => resolve({ tabId: `tab_${tabId}`, panelId: `panel_${tabId}` }));
            const tabPromise = new Promise((resolve, resject) => {
                this.stackedEvent.afterSwitchTab.push(resolve);
            });
            const panelPromise = new Promise((resolve, resject) => {
                this.stackedEvent.afterSwitchPanel.push(resolve);
            });
            this.dispatch({
                type: actions.active,
                tabId: tabId,
                addRenderedCom: () =>
                    this.renderedComponent.addById(tabId, this.getMutableCurrentOptions().data.allTabs[tabId].panelComponent),
            });
            return Promise.all([tabPromise, panelPromise])
                .then(([tabId, panelId]) => {
                    afterSwitchTab({ tabId: `tab_${tabId}`, panelId: `panel_${tabId}` });
                    return { tabId: `tab_${tabId}`, panelId: `panel_${tabId}` };
                }).catch(function (err) {
                    throw err.message;
                });;
        };
        this.reset = function () { this.reset(); return this; };
        this.getOptions = function () { return this.getCurrentOptionsCopy(); };
        this.getData = function () { return { ...this.state }; };
        Object.defineProperties(this, {
            state: createDescriptor({ openTabsId: [], activeTabId: '' }),
            dispatch: createDescriptor(() => { }),
            optionManager: createDescriptor(optionManagerInstance),
            renderedComponent: createDescriptor(renderedComponentInstance),
            stackedEvent: (function () {
                const createObj = () => ({
                    _value: [],
                    push: function (value) { return this._value.push(value); },
                    flush: function (param) { while (this._value.length) this._value.pop()(param); }
                });
                return createDescriptor({
                    afterSwitchTab: createObj(),
                    afterSwitchPanel: createObj(),
                    afterCloseTab: createObj(),
                    afterClosePanel: createObj(),
                    afterOpenTab: createObj(),
                    afterOpenPanel: createObj(),
                });
            })()
        });
    };
    api.prototype = Object.create(baseApiInstance);
    api.prototype.constructor = api;
    api.prototype.tabDidMount = function ({ tabId, isActive }) {
        this.stackedEvent.afterOpenTab.flush({ tabId, isActive });
    };
    api.prototype.panelDidMount = function ({ panelId, isActive }) {
        this.stackedEvent.afterOpenPanel.flush({ panelId, isActive });
    };
    api.prototype.tabDidUpdate = function ({ tabId, isActive, counter }) { };
    api.prototype.panelDidUpdate = function ({ panelId, isActive, counter }) { };
    api.prototype.tabListDidUpdateByActiveTabId = function (activeTabId, counter) {
        counter > 1 && this.stackedEvent.afterSwitchTab.flush(activeTabId);
    };
    api.prototype.panelListDidUpdateByActiveTabId = function (activeTabId, counter) {
        counter > 1 && this.stackedEvent.afterSwitchPanel.flush(activeTabId);
    };
    api.prototype.activeTabEventHandler = function ({ e, tabId }) {
        const { activeTabEventMode, events } = this.getMutableCurrentOptions(), { type } = e;
        events[`on${type}Tab`](e, tabId);
        ((type === activeTabEventMode) && events.beforeActiveTab(e, tabId))
            && this.activeTab(tabId);
    };
    return api;
};
