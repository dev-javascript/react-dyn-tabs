const getUserProxy = function (ctx) {
    const proxy = {
        getSelectedTabsHistory: function () { return ctx.getSelectedTabsHistory(); },
        getMutableOptions: function () { return ctx.getOptions(); },
        getCopyOptions: function () { return ctx.optionManager.getCopyOptions(); },
        getCopyData: function () { return ctx.getCopyData(); },
        getTabObj: function (tabId) { return ctx.getTabObj(tabId); },
        isActiveTab: function (tabId) { return ctx.isActiveTab(tabId); },
        isOpenTab: function (tabId) { return ctx.isOpenTab(tabId); },
        select: function (tabId) {
            return ctx.select(tabId);
        },
        open: function (tabId) { return ctx.open(tabId); },
        add: function (tabObj) { ctx.add(tabObj); return this; },
        close: function (tabId, switchBeforeClose = true) {
            return ctx.close(tabId, switchBeforeClose);
        },
        reload: function () { return ctx.reload(); },
        clearPanelsCache: function (panelId) { ctx.clearPanelsCache(panelId); return this; },
        setData: function (param) { return ctx.setData(param); }
        // develop validation for calling each function
    };
    return proxy;
};
export default getUserProxy;