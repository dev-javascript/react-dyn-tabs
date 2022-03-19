const Virtualizor = function (deps, ctx) {
  const {resizeDetectorIns, Main} = deps;
  // todo get minWidth from option + set width=100% and display inline style on tablist
  this.minWidth = 160;
  Main.call(this, resizeDetectorIns, ctx);
  const {setting} = ctx.optionsManager;
  setting.getRenderableTabs = () => [];
  ctx.one('onLoad', () => {
    setting.getRenderableTabs = (openTabIDs) => {
      const tabsNumber = Math.round(this.tablistEl.clientWidth / this.minWidth);
      const {selectedTabID} = ctx.getData();
      const renderableTabs = openTabIDs.slice(0, tabsNumber);
      if (selectedTabID && openTabIDs.indexOf(selectedTabID) > tabsNumber - 1) {
        renderableTabs.push(selectedTabID);
        return renderableTabs;
      }
      return renderableTabs;
    };
    ctx.refresh();
  });
};
export const VirtualizorConstructor = Virtualizor;
export const VirtualizorMethods = {
  onResize: function () {
    this.api.refresh().then(() => {
      this.setTabsVisibility(this.api.getData());
    });
  },
};
