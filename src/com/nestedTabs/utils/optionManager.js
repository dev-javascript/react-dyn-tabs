const _cloneObje = function (obj) {
    //return JSON.parse(JSON.stringify(obj));
    return Object.assign({}, obj);
};
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
optionManager.prototype.getDefaultOptions = (function () {
    const createObjectDescriptor = value => ({ value: value, writable: true, configurable: true, enumerable: true });
    return function () {
        const events = Object.defineProperties({}, {
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
        const option = {
            data: {
                allTabs: [
                    {
                        id: "",
                        title: "",
                        tooltip: "",
                        panelComponent: null,
                        closable: true,
                        iconClass: "",
                    },
                ],
                openTabsId: [],
                activeTabId: null
            },
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
        Object.defineProperty(option, 'events', {
            get() { return events; },
            set(value) {
                if ((typeof value !== 'object') || (value === null))
                    throw 'type of the given events property must be an object';
                events = events || {};
                const reducer = function (acc, item) {
                    value[item] && (acc[item] = value[item]);
                };
                Object.keys(value).reduce(reducer, events);
            }
        });
        return option;
    };
})();
export default optionManager;