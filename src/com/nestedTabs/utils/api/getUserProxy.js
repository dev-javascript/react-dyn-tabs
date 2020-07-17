const getUserProxy = function (ctx) {
    const proxy = {
        getSelectedTabsHistory: function () { return ctx.getSelectedTabsHistory(); },
        getMutableCurrentOptions: function () { return ctx.getMutableCurrentOptions(); },
        getData: function () { return ctx.getData(); },
        getTabObj: function (tabId) { return ctx.getTabObj(tabId); },
        isActiveTab: function (tabId) { return ctx.isActiveTab(tabId); },
        isOpenTab: function (tabId) { return ctx.isOpenTab(tabId); },
        switchTab: function (tabId) { return ctx.switchTab({ id: tabId, e: null }); },
        deactiveTab: function () { return ctx.deactiveTab(null); },
        switchToNxtSiblingTab: function () { return ctx.switchToNxtSiblingTab({ e: null }); },
        switchToPreSiblingTab: function () { return ctx.switchToPreSiblingTab({ e: null }); },
        switchToPreSelectedTab: function () { return ctx.switchToPreSelectedTab({ e: null }); },
        openTab: function (tabId) { return ctx.openTab(tabId); },
        addTab: function (tabObj) { ctx.addTab(tabObj); return this; },
        closeTab: function (tabId, switchBeforeClose) { return ctx.closeTab({ id: tabId, e: null, switchBeforeClose }); },
        forceUpdate: function () { return ctx.forceUpdate(); },
        clearPanelsCache: function (panelId) { ctx.clearPanelsCache(panelId); return this; },

        resetToInitailOption: function () { ctx.resetToInitailOption(); return this; },
        openAllTab: function () { return ctx.openAllTab(); }
    };
    return proxy;
};
export default getUserProxy;