import React from 'react';
const MoreButton = function (resizeDetectorIns, ctx) {
  this._api = ctx;
  this._data = null;
  this._overflowedTabIndex = '';
  this._overflowedSelectedTabIndex = '';
  this._selectedTabIndex = '';
  this._viewportTabsWidth = null;
  this._dir = '';
  this._moreBtnWidth = null;
  this._sliderWidth = null;
  this._tablistPos = null;
  this._selectedTabPos = null;
  this.isBtnVisible = false;
  this.resizeDetectorIns = resizeDetectorIns;
  this._tabEls = null;
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
  _setOverflowedSelectedTabIndex: function () {
    this._overflowedSelectedTabIndex = -1;
    if (this._tablistPos.right < this._selectedTabPos.left) {
      this._overflowedSelectedTabIndex = this._selectedTabIndex;
    }
    return this;
  },
  _setMoreBtnsCom: function () {
    const that = this;
    const _style = {
      position: 'absolute',
      top: '50%',
      left: '0px',
      right: 'auto',
      transform: 'translate(-170px,-50%)',
      minWidth: '16px',
      minHeight: '16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    this._api.optionsManager.setting.MoreButtonComponent = function MoreButtonComponent() {
      return (
        <button ref={that.moreBtnsEl} value="more" style={_style}>
          more
        </button>
      );
    };
    return this;
  },
  _hideMoreBtn: function () {
    if (this.isBtnVisible === true) {
      this.isBtnVisible = false;
      return this._hide(this.moreBtnsEl.current);
    }
    return this;
  },
  _showMoreBtn: function (left) {
    this.isBtnVisible = true;
    return this._hide(this.moreBtnsEl.current, left, '-50%');
  },
  _calculateMoreBtnXPos: function (totalTabsWidth, selectedTabWidth, moreBtnWidth, sliderWidth) {
    let xPos;
    if (this._api.getOption('direction') === 'ltr') {
      xPos = totalTabsWidth + selectedTabWidth + 5;
      xPos = xPos > sliderWidth - moreBtnWidth ? sliderWidth - moreBtnWidth - 5 : xPos;
      return xPos;
    } else {
      xPos = sliderWidth - totalTabsWidth - selectedTabWidth - moreBtnWidth - 5;
      xPos = xPos < 0 ? 5 : xPos;
      return xPos;
    }
  },
  destroy: function () {
    if (this.sliderEl && this.resizeDetectorIns) this.resizeDetectorIns.uninstall(this.sliderEl);
  },
  _getPos: function (el) {
    const pos = el.getBoundingClientRect(),
      style = el.currentStyle || window.getComputedStyle(el),
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    pos.width = pos.width + margin;
    return pos;
  },
  _getElTotalWidth: function (element) {
    const style = element.currentStyle || window.getComputedStyle(element),
      width = element.offsetWidth, // or use style.width
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    //padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
    //border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    return width + margin;
  },
  _showAllTabs: function () {
    this._tabEls.forEach((tab) => this._show(tab));
    return this;
  },
  _hide: function (el) {
    el.style.transform = 'translate(0px,200px)';
    return this;
  },
  _show: function (el, x, y) {
    el.style.transform = `translate(${x || 0}px,${y || '0px'})`;
    return this;
  },
  _loop: function (arr, startIndex, stopIndex, callback) {
    for (let i = startIndex; i < stopIndex; i++) {
      callback(arr[i], i);
    }
  },
  _checkTablistOverflow: function () {
    const sliderEl = this.sliderEl;
    this._sliderWidth = sliderEl.clientWidth;
    return this._sliderWidth < sliderEl.scrollWidth;
  },
  _setOverflowedTabIndex: function () {
    this._viewportTabsWidth = 0;
    this._overflowedTabIndex = -1;
    const availableWidth = this._sliderWidth - this._selectedTabPos.width - this._moreBtnWidth - 5;
    for (let i = 0; i < this.data.openTabIDs.length; i++) {
      // if is selected
      if (i === this._selectedTabIndex) {
        continue;
      }
      const elWidth = this._getElTotalWidth(this._tabEls[i]);
      if (elWidth + this._viewportTabsWidth > availableWidth) {
        this._overflowedTabIndex = i;
        return this;
      } else {
        this._viewportTabsWidth += elWidth;
      }
    }
    return this;
  },
  resize: function () {
    this._tabEls = this.tablistEl.childNodes;
    this._hideMoreBtn()._showAllTabs();
    // more-button should not work if isVertical option is true
    const {isVertical, direction} = this._api.optionsManager.options;
    if (isVertical === true) {
      return;
    }
    this._dir = direction;
    requestAnimationFrame(() => {
      this._resize();
    });
  },
  _resize: function () {
    if (this._checkTablistOverflow()) {
      this.data = this._api.getData();
      this._moreBtnWidth = this._getElTotalWidth(this.moreBtnsEl.current);
      this._tablistPos = this._getPos(this.tablistEl);
      this._selectedTabIndex = this.data.openTabIDs.indexOf(this.data.selectedTabID);
      this._selectedTabPos = this._getPos(this._tabEls[this._selectedTabIndex]);
      this._setOverflowedSelectedTabIndex()._setOverflowedTabIndex();

      if (this._overflowedTabIndex !== -1) {
        this._loop(this._tabEls, this._overflowedTabIndex, tabsCount, (tab, i) => {
          if (i === _selectedTabIndex) {
            tab.style.transform = `translate(${right}px,0px)`;
          } else {
            this._hide(tab);
          }
        });
      } else {
        this._hideMoreBtn();
      }
    } else {
      this._hideMoreBtn();
    }
  },
});
export default MoreButton;
