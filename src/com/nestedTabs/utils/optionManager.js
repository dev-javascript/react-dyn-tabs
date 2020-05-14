const _cloneObje = function (obj) {
    return JSON.parse(JSON.stringify(obj));
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
optionManager.prototype.getDefaultOptions = function () {
    return {
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
        events: {
            onmousedownTab: function (e, tabId) { },
            onclickTab: function (e, tabId) { },
            onmouseupTab: function (e, tabId) { },
            onmousedownTabCloseIcon: function (e, tabId) { },
            onclickTabCloseIcon: function (e, tabId) { },
            onmouseupTabCloseIcon: function (e, tabId) { },

            beforeActiveTab: function (e, tabId) { return true; },
            afterActiveTab: function ({ tabId, panelId }) {
                console.log(`afterActiveTab with tabId : ${tabId} and panelId : ${panelId}`);
            },
            beforeDeactiveTab: function () { return true; },
            afterDeactiveTab: function () { },

            tabDidMount: function () { },
            tabDidUpdate: function () { },
            tabWillUnMount: function () { },

            beforeCloseTab: function (e, tabId) { return true; },
            afterClosetab: function () { },

            allTabsDidMount: function () { },
            allTabsDidUpdate: function () { },
            allTabsWillUnMount: function () { },
            onSwitchTabs: function () { },
            onChangeOpenTabs: function () { },

            afterOpenTab: function () { },
        },
        responsiveMode: "icon/moveable/buttonMenu/none",
        switchTabMode: "hover/onClick/onMouseDown/onMouseUp",
        activeTabEventMode: 'mousedown',
        closeTabEventMode: 'click',
        responsiveMode: 'none'
    };
};
export default optionManager;