const getUserProxy = function (ctx) {
    const _proxy = {
        setOption: function (name, value) { ctx.setOption(name, value); return this; },
        getTabObj: function (tabId) { return ctx.getTabObj(tabId); },
        isSelected: function (tabId) { return ctx.isSelected(tabId); },
        isOpen: function (tabId) { return ctx.isOpen(tabId); },
        select: function (tabId) { return ctx.select(tabId); },
        open: function (tabId) { return ctx.open(tabId); },
        add: function (tabObj) { ctx.add(tabObj); return this; },
        close: function (tabId, switchBeforeClose) { return ctx.close(tabId, switchBeforeClose); },
        getData: function () { return ctx.getCopyData(); },
        setData: function (param) { return ctx.setData(param); },
        reload: function () { return ctx.reload(); },
        clearPanelCache: function (panelId) { ctx.clearPanelCache(panelId); return this; }
    };
    return _proxy;
};
export default getUserProxy;