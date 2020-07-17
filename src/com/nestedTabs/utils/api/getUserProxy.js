const getUserProxy = function (ctx) {
    const proxy = {
        getSelectedTabsHistory: function () { return ctx.getSelectedTabsHistory(); },
        getMutableCurrentOptions: function () { return ctx.getMutableCurrentOptions(); },
        reset: function () { ctx.reset(); return this; },
        getData: function () { return ctx.getData(); },
        isActiveTab: function (tabId) { return ctx.isActiveTab(tabId); },
        isOpenTab: function (tabId) { return ctx.isOpenTab(tabId); },
        openAllTab: function () { return ctx.openAllTab(); },
        switchTab: function (tabId) { return ctx.switchTab({ id: tabId, e: null }); },
        deactiveTab: function () { return ctx.deactiveTab(null); },
        switchToNxtSiblingTab: function () { return ctx.switchToNxtSiblingTab({ e: null }); },
        switchToPreSiblingTab: function () { return ctx.switchToPreSiblingTab({ e: null }); },
        switchToPreSelectedTab: function () { return ctx.switchToPreSelectedTab({ e: null }); },
        openTab: function (tabId) { return ctx.openTab(tabId); },
        addTab: function (tabObj) { ctx.addTab(tabObj); return this; },
        closeTab: function (tabId, switchBeforeClose) { return ctx.closeTab({ id: tabId, e: null, switchBeforeClose }); },
        forceUpdate: function () { return ctx.forceUpdate(); },
        clearPanelsCache: function (panelId) { ctx.clearPanelsCache(panelId); return this; }
    };
    return proxy;
};
export default getUserProxy;