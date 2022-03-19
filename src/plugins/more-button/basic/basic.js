const Basic = function (resizeDetectorIns, ctx) {
  this.api = ctx;
  // todo get it from options
  this.hiddenClass = 'rc-dyn-tabs-hide';
  this.tablistEl = ctx.tablistRef;
  ctx.one('onLoad', () => {
    this.tablistEl = this.tablistEl.current;
    resizeDetectorIns.listenTo(this.tablistEl.parentElement, () => {
      this.onResize();
    });
  });
  ctx.on('onChange', () => {
    this.setTabsVisibility(ctx.getData());
  });
  // todo
  ctx.on('onResize', () => {
    this.setTabsVisibility(ctx.getData());
  });
};
Object.assign(Basic.prototype, {
  onResize: function () {
    this.setTabsVisibility(this.api.getData());
  },
  setTabsVisibility: function ({selectedTabID, openTabIDs}) {
    // ltr direction
    const {tablistEl, hiddenClass} = this,
      tabEls = tablistEl.childNodes,
      tabsCount = tabEls.length,
      _openTabIDs = openTabIDs.slice(0, openTabIDs.indexOf(tabEls[tabsCount - 1].getAttribute('tab-id')) + 1);
    // make all tabs visible
    for (let i = 0; i < tabsCount; i++) {
      const el = tabEls[i];
      el.classList.remove(hiddenClass);
    }
    let counter = 0;
    while (tablistEl.clientWidth < tablistEl.scrollWidth) {
      if (counter === tabsCount) {
        break;
      }
      counter++;
      const tabID = _openTabIDs.pop();
      if (tabID === selectedTabID) {
        tabEls[tabsCount - counter].classList.remove(hiddenClass);
      } else {
        tabEls[tabsCount - counter].classList.add(hiddenClass);
      }
    }
    // rtl direction todo
  },
});
export default Basic;
