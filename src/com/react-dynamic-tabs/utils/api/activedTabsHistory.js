const HistoryActiveTabs = function () {
    this.tabsId = [];
};
HistoryActiveTabs.prototype.getTab = function () { return this.tabsId.pop(); };
HistoryActiveTabs.prototype.reset = function () { this.tabsId = []; };
HistoryActiveTabs.prototype.add = function (id) {
    const tabsId = this.tabsId;
    tabsId[tabsId.length - 1] === id || tabsId.push(id);
};
export default HistoryActiveTabs;