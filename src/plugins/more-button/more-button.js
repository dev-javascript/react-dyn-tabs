const MoreButton = function (resizeDetectorIns, ctx) {
  if (ctx.getOption('isVertical')) {
    return;
  }
  this.api = ctx;
  this.resizeDetectorIns = resizeDetectorIns;
  this._firstHiddenChildIndex = -1;
  this.hiddenClass = ctx.optionsManager.setting.hiddenClass;
  this.tablistEl = ctx.tablistRef;

  ctx
    .one('onLoad', () => {
      this.tablistEl = this.tablistEl.current;
      this.tablistEl.style.overflow = 'hidden';
      this.sliderEl = this.tablistEl.parentElement;
      this.sliderEl.style.overflow = 'hidden';
      if (resizeDetectorIns)
        resizeDetectorIns.listenTo(this.sliderEl, () => {
          this.resize();
        });
    })
    .on('onChange', () => {
      this.resize();
    })
    .on('onDestroy', () => {
      this.destroy();
    });
};
Object.assign(MoreButton.prototype, {
  destroy: function () {
    if (this.sliderEl && this.resizeDetectorIns) this.resizeDetectorIns.uninstall(this.sliderEl);
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
  },
  _show: function (el) {
    el.classList.remove(this.hiddenClass);
  },
  _changeTabsStyle: function (tabs, startIndex, stopIndex, callback) {
    const {tablistEl} = this;
    this._hide(tablistEl);
    for (let i = startIndex; i < stopIndex; i++) {
      callback(tabs[i], i);
    }
    this._show(tablistEl);
  },
  _checkTablistOverflow: function (tablistWidth) {
    return tablistWidth < this.tablistEl.scrollWidth;
  },
  _setFirstHiddenChildIndex: function (selectedTabIndex, tablist, tablistLength, tablistWidth) {
    let totalWidth = 0;
    const availableWidth = tablistWidth - this._getElTotalWidth(tablist[selectedTabIndex]);
    for (let i = 0; i < tablistLength; i++) {
      // if is selected
      if (i === selectedTabIndex) {
        continue;
      }
      const elWidth = this._getElTotalWidth(tablist[i]);
      if (elWidth + totalWidth > availableWidth) {
        return i;
      } else {
        totalWidth += elWidth;
      }
    }
    return -1;
  },
  resize: function () {
    // more-button should not work if isVertical option is true
    if (this.api.getOption('isVertical')) {
      return;
    }
    const {selectedTabID, openTabIDs} = this.api.getData();
    window.requestAnimationFrame(() => {
      this._resize(this.tablistEl.childNodes, openTabIDs.length, openTabIDs.indexOf(selectedTabID));
    });
  },
  _resize: function (tabEls, tabsCount, selectedTabIndex) {
    // check if there is a hidden tab previously
    if (this._firstHiddenChildIndex !== -1)
      this._changeTabsStyle(tabEls, this._firstHiddenChildIndex, tabsCount, (tab) => {
        this._show(tab);
      });
    const tablistWidth = this.tablistEl.clientWidth;
    if (this._checkTablistOverflow(tablistWidth)) {
      this._firstHiddenChildIndex = this._setFirstHiddenChildIndex(selectedTabIndex, tabEls, tabsCount, tablistWidth);
      this._changeTabsStyle(tabEls, this._firstHiddenChildIndex, tabsCount, (tab, i) => {
        if (i !== selectedTabIndex) this._hide(tab);
      });
    } else {
      this._firstHiddenChildIndex = -1;
    }
  },
});
export default MoreButton;
