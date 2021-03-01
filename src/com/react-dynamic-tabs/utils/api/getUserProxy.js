const getUserProxy = function (ctx) {
    const _proxy = {
        setOption: function (name, value) { ctx.setOption(name, value); return this; },
        getTab: function (tabId) { return ctx.getTab(tabId); },
        isSelected: function (tabId) { return ctx.isSelected(tabId); },
        isOpen: function (tabId) { return ctx.isOpen(tabId); },
        select: function (tabId) { return ctx.select(tabId); },
        open: function (tabId) { return ctx.open(tabId); },
        close: function (tabId, switchBeforeClose) { return ctx.close(tabId, switchBeforeClose); },
        getData: function () { return ctx.getCopyData(); },
        refresh: function () { return ctx.refresh(); }
    };
    return _proxy;
};
export default getUserProxy;