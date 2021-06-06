const HistoryActiveTabs = function () {
  this.tabsId = [];
};
HistoryActiveTabs.prototype.popLastTabID = function () {
  return this.tabsId.pop();
};
HistoryActiveTabs.prototype.reset = function () {
  this.tabsId = [];
};
HistoryActiveTabs.prototype.add = function (id) {
  this.tabsId.push(id);
};
HistoryActiveTabs.prototype.remove = function (id) {
  const tabIDs = this.tabsId;
  while (tabIDs.indexOf(id) >= 0) {
    tabIDs.splice(tabIDs.indexOf(id), 1);
  }
  return this;
};
export default HistoryActiveTabs;
