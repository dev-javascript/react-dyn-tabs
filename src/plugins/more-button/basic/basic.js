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
    this.onResize();
  });
  ctx.userProxy.resize = () => {
    this.onResize();
    return ctx.userProxy;
  };
};
Object.assign(Basic.prototype, {
  onResize: function () {
    window.requestAnimationFrame(() => {
      this.setTabsVisibility(this.api.getData());
    });
  },
  _getElTotalWidth: function (element) {
    const style = element.currentStyle || window.getComputedStyle(element),
      width = element.offsetWidth, // or use style.width
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
      padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
      border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    return width + margin + padding + border;
  },
  _hide: function (el) {
    el.classList.add(this.hiddenClass);
    //el.style.transform = 'scale(0)';
  },
  _show: function (el) {
    el.classList.remove(this.hiddenClass);
    //el.style.transform = 'scale(1)';
  },
  setTabsVisibility: function ({selectedTabID, openTabIDs}) {
    // ltr direction
    const {tablistEl} = this,
      tabEls = tablistEl.childNodes,
      tabsCount = tabEls.length;
    // make all tabs visible
    this._hide(this.tablistEl);
    for (let j = 0; j < tabsCount; j++) {
      this._show(tabEls[j]);
    }
    this._show(this.tablistEl);
    // find firstHiddenChildIndex value
    const selectedTabIndex = openTabIDs.indexOf(selectedTabID),
      selectedTabWidth = this._getElTotalWidth(tabEls[selectedTabIndex]),
      availableWidth = tablistEl.clientWidth - selectedTabWidth;
    let totalWidth = 0,
      firstHiddenChildIndex = -1;
    for (let i = 0; i < tabsCount; i++) {
      // if is selected
      if (i === selectedTabIndex) {
        continue;
      }
      const elWidth = this._getElTotalWidth(tabEls[i]);
      if (elWidth + totalWidth > availableWidth) {
        firstHiddenChildIndex = i;
        break;
      } else {
        totalWidth += elWidth;
      }
    }
    // make overflowed tabs hidden
    if (firstHiddenChildIndex !== -1) {
      this._hide(this.tablistEl);
      for (let k = firstHiddenChildIndex; k < tabsCount; k++) {
        if (k !== selectedTabIndex) this._hide(tabEls[k]);
      }
      this._show(this.tablistEl);
    }
  },
});
export default Basic;
