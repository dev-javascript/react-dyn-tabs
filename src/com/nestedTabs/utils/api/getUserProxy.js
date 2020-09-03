const getUserProxy = function (ctx) {
    const proxy = {
        getSelectedTabsHistory: function () { return ctx.getSelectedTabsHistory(); },
        getMutableOptions: function () { return ctx.getOptions(); },
        getCopyOptions: function () { return ctx.optionManager.getCopyOptions(); },
        getCopyData: function () { return ctx.getCopyData(); },
        getTabObj: function (tabId) { return ctx.getTabObj(tabId); },
        isActiveTab: function (tabId) { return ctx.isActiveTab(tabId); },
        isOpenTab: function (tabId) { return ctx.isOpenTab(tabId); },
        switchTab: function (tabId, triggerOnSwitchTab = true) {
            return ctx.switchTab(tabId, triggerOnSwitchTab);
        },
        deselectTab: function (triggerOnSwitchTab = true) { return ctx.deselectTab(triggerOnSwitchTab); },
        switchToNxtSiblingTab: function (triggerOnSwitchTab = true) { return ctx.switchToNxtSiblingTab(triggerOnSwitchTab); },
        switchToPreSiblingTab: function (triggerOnSwitchTab = true) { return ctx.switchToPreSiblingTab(triggerOnSwitchTab); },
        switchToPreSelectedTab: function (triggerOnSwitchTab = true) { return ctx.switchToPreSelectedTab(triggerOnSwitchTab); },
        openTab: function (tabId, triggerOnOpenTab = true) { return ctx.openTab(tabId, triggerOnOpenTab); },
        addTab: function (tabObj) { ctx.addTab(tabObj); return this; },
        closeTab: function (tabId, switchBeforeClose = true, triggerOnCloseTab = true, triggerOnSwitchTab = true) {
            return ctx.closeTab(tabId, switchBeforeClose, triggerOnCloseTab, triggerOnSwitchTab);
        },
        forceUpdate: function () { return ctx.forceUpdate(); },
        clearPanelsCache: function (panelId) { ctx.clearPanelsCache(panelId); return this; },
        setData: function (param) {
            const { activeTabId, openTabsId } = param;
            param.hasOwnProperty('triggerOnOpenTab') || (param.triggerOnOpenTab = true);
            param.hasOwnProperty('triggerOnSwitchTab') || (param.triggerOnSwitchTab = true);
            param.hasOwnProperty('triggerOnCloseTab') || (param.triggerOnCloseTab = true);
            return ctx.setData(param);
        }
        // develop validation for calling each function
    };
    return proxy;
};
export default getUserProxy;