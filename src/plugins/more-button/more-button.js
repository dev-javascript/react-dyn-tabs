import React from 'react';
const MoreButton = function (resizeDetectorIns, ctx) {
  if (ctx.getOption('isVertical')) {
    return;
  }
  this.api = ctx;
  this.resizeDetectorIns = resizeDetectorIns;
  this._firstHiddenChildIndex = -1;
  this.hiddenClass = ctx.optionsManager.setting.hiddenClass;
  this.tablistEl = ctx.tablistRef;
  this.moreBtnsEl = React.createRef(null);
  this._setMoreBtnsCom();
  ctx.userProxy.resize = () => {
    this.resize();
  };
  ctx
    .one('onLoad', () => {
      this.tablistEl = this.tablistEl.current;
      this.tablistEl.style.overflow = 'visible';
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
  _setMoreBtnsCom: function () {
    const that = this;
    const _style = {
      position: 'absolute',
      top: '50%',
      left: '0px',
      transform: 'translate(0,-50%)',
      minWidth: '16px',
      minHeight: '16px',
      opacity: 0,
      zIndex: -1,
    };
    this.api.optionsManager.setting.MoreButtonComponent = function MoreButtonComponent() {
      return (
        <button ref={that.moreBtnsEl} value="more" style={_style}>
          more
        </button>
      );
    };
    return this;
  },
  _hideMoreBtn: function () {
    const el = this.moreBtnsEl.current;
    el.style.opacity = 0;
    el.style.zIndex = -1;
    el.style.transform = 'translate(0,-50%)';
  },
  _showMoreBtn: function (x) {
    const el = this.moreBtnsEl.current;
    el.style.opacity = 0.8;
    el.style.zIndex = 2;
    el.style.transform = `translate(${x}px,-50%)`;
  },
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
  _checkTablistOverflow: function (sliderWidth) {
    return sliderWidth < this.sliderEl.scrollWidth;
  },
  _setFirstHiddenChildIndex: function (selectedTabIndex, tablist, tablistLength, sliderWidth) {
    let totalWidth = 0;
    const selectedTabWidth = this._getElTotalWidth(tablist[selectedTabIndex]);
    const availableWidth = sliderWidth - selectedTabWidth - this.moreBtnsEl.current.clientWidth;
    for (let i = 0; i < tablistLength; i++) {
      // if is selected
      if (i === selectedTabIndex) {
        continue;
      }
      const elWidth = this._getElTotalWidth(tablist[i]);
      if (elWidth + totalWidth > availableWidth) {
        this._showMoreBtn(totalWidth + selectedTabWidth + 5);
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
    this._resize(this.tablistEl.childNodes, openTabIDs.length, openTabIDs.indexOf(selectedTabID));
  },
  _resize: function (tabEls, tabsCount, selectedTabIndex) {
    // check if there is a hidden tab previously
    if (this._firstHiddenChildIndex !== -1)
      this._changeTabsStyle(tabEls, this._firstHiddenChildIndex, tabsCount, (tab) => {
        this._show(tab);
      });
    requestAnimationFrame(() => {
      const sliderWidth = this.sliderEl.clientWidth;
      if (this._checkTablistOverflow(sliderWidth)) {
        this._firstHiddenChildIndex = this._setFirstHiddenChildIndex(selectedTabIndex, tabEls, tabsCount, sliderWidth);
        if (this._firstHiddenChildIndex !== -1) {
          this._changeTabsStyle(tabEls, this._firstHiddenChildIndex, tabsCount, (tab, i) => {
            if (i !== selectedTabIndex) this._hide(tab);
          });
        } else {
          this._hideMoreBtn();
        }
      } else {
        this._hideMoreBtn();
        this._firstHiddenChildIndex = -1;
      }
    });
  },
});
export default MoreButton;
