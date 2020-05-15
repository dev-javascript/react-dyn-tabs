function optionManager(param = {}) {
    const { options } = param;
    this.currentOptions = {};
    this.initialOptions = {};
    options && this.setNewOptions(options);
};
optionManager.prototype.reset = function () { this.currentOptions = this.getInitialOptionsCopy(); return this; };
optionManager.prototype.getInitialOptionsCopy = function () { return Object.assign(this.getDefaultOptions(), this.initialOptions); };
optionManager.prototype.getCurrentOptionsCopy = function () { return Object.assign(this.getDefaultOptions(), this.currentOptions); };
optionManager.prototype.getMutableCurrentOptions = function () { return this.currentOptions; };
optionManager.prototype.setNewOptions = function (newOptions) {
    Object.keys(this.initialOptions).length ||
        (this.initialOptions = Object.assign(this.getDefaultOptions(), newOptions));
    this.currentOptions = Object.assign(this.getDefaultOptions(), newOptions);
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
optionManager.prototype.getDefaultOptions = (function () {
    const createObjectDescriptor = value => ({ value: value, writable: true, configurable: true, enumerable: true });
    const checkObjectType = (value, prop) => { if ((typeof value !== 'object') || (value === null)) throw `type of the given ${prop} property must be an object`; };
    return function () {
        let option;
        option = {
            classNames: {
                tabList: "",
                panelList: "",
                tab: "",
                hoverTab: "",
                activeTab: "",
                hoverActiveTab: "",
                closeIcon: "",
                hoverCloseIcon: "",
                panel: "",
                activePanel: "",
            },
            responsiveMode: "icon/moveable/buttonMenu/none",
            switchTabMode: "hover/onClick/onMouseDown/onMouseUp",
            activeTabEventMode: 'mousedown',
            closeTabEventMode: 'click',
            responsiveMode: 'none'
        };
        Object.defineProperties(option, {
            data: (function () {
                let data = {}
                return {
                    get() { return data; },
                    set(value) {
                        checkObjectType(value, 'data');
                        data = data || {};
                        const reducer = function (acc, item) {
                            (acc[item] = value[item]);
                            return acc;
                        };
                        Object.keys(value).reduce(reducer, data);
                    }
                };
            })(),
            events: (function () {
                let events = {};
                return {
                    get() { return events; },
                    set(value) {
                        checkObjectType(value, 'events');
                        events = events || {};
                        const reducer = function (acc, item) {
                            (acc[item] = value[item]);
                            return acc;
                        };
                        Object.keys(value).reduce(reducer, events);
                    }
                };
            })()
        });
        Object.defineProperties(option.data, {
            allTabs: (function () {
                let allTabs = {};
                return {
                    get() { return allTabs; },
                    set(value) {
                        checkObjectType(value, 'allTabs');
                        const reducer = function (acc, item, i) {
                            if (!item.id) throw `option.data.allTabs[${i}].id must be a valid number and grater then zero`;
                            acc[item.id] = Object.assign({
                                id: "",
                                title: "unkow",
                                tooltip: "",
                                panelComponent: null,
                                closable: true,
                                iconClass: "",
                            }, item);
                            return acc;
                        };
                        value.reduce(reducer, allTabs);
                    }
                };
            })(),
            openTabsId: createObjectDescriptor([]),
            activeTabId: createObjectDescriptor('')
        });
        Object.defineProperties(option.events, {
            onmousedownTab: createObjectDescriptor(() => { }),
            onclickTab: createObjectDescriptor(() => { }),
            onmouseupTab: createObjectDescriptor(() => { }),
            onmousedownTabCloseIcon: createObjectDescriptor(() => { }),
            onclickTabCloseIcon: createObjectDescriptor(() => { }),
            onmouseupTabCloseIcon: createObjectDescriptor(() => { }),

            beforeActiveTab: createObjectDescriptor(function (e, tabId) { return true; }),
            afterActiveTab: createObjectDescriptor(function ({ tabId, panelId }) {
                console.log(`afterActiveTab with tabId : ${tabId} and panelId : ${panelId}`);
            }),
            beforeDeactiveTab: createObjectDescriptor(function () { return true; }),
            afterDeactiveTab: createObjectDescriptor(() => { }),

            tabDidMount: createObjectDescriptor(() => { }),
            tabDidUpdate: createObjectDescriptor(() => { }),
            tabWillUnMount: createObjectDescriptor(() => { }),

            beforeCloseTab: createObjectDescriptor(function (e, tabId) { return true; }),
            afterClosetab: createObjectDescriptor(() => { }),

            allTabsDidMount: createObjectDescriptor(() => { }),
            allTabsDidUpdate: createObjectDescriptor(() => { }),
            allTabsWillUnMount: createObjectDescriptor(() => { }),
            onSwitchTabs: createObjectDescriptor(() => { }),
            onChangeOpenTabs: createObjectDescriptor(() => { }),

            afterOpenTab: createObjectDescriptor(() => { }),
        });
        return option;
    };
})();
export default optionManager;