import React from 'react';
const MoreButton = function (resizeDetectorIns, ctx) {
  this._api = ctx;
  this._data = null;
  this._overflowedTabIndexs = [];
  this._firstOverflowedTabPos = null;
  this._overflowedSelectedTabIndex = -1;
  this._selectedTabIndex = -1;
  this._dir = '';
  this._moreBtnFullWidth = null;
  this._sliderPos = null;
  this._selectedTabPos = null;
  this._overflowedSelectedTabFullWidth = null;
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
    switch (this._dir) {
      case 'ltr':
        if (this._sliderPos.right - this._moreBtnFullWidth < this._selectedTabPos.right) {
          this._overflowedSelectedTabIndex = this._selectedTabIndex;
        }
        break;
      case 'rtl':
        if (this._selectedTabPos.left < this._sliderPos.left + this._moreBtnFullWidth) {
          this._overflowedSelectedTabIndex = this._selectedTabIndex;
        }
        break;
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
    if (this.isBtnVisible == false) {
      this.isBtnVisible = true;
      return this._hide(this.moreBtnsEl.current, left, '-50%');
    }
    return this;
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
    const style = element.currentStyle || window.getComputedStyle(element);
    return element.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  },
  _showOverflowedTabs: function () {
    this._overflowedTabIndexs.forEach((index) => {
      const el = this._tabEls[index];
      el && this._show(el);
    });
    this._overflowedTabIndexs = [];
    if (this._overflowedSelectedTabIndex >= 0) {
      const el = this._tabEls[this._overflowedSelectedTabIndex];
      el && this._show(el);
      this._overflowedSelectedTabIndex = -1;
    }
    return this;
  },
  _hide: function (el) {
    el.style.transform = 'translate(0px,200px)';
    return this;
  },
  _hideOverflowedTabs: function () {
    this._overflowedTabIndexs.forEach((index) => {
      this._hide(this._tabEls[index]);
    });
  },
  _moveSelectedOverflowedTab() {
    //factory
    let targetLeftPos;
    switch (this._dir) {
      case 'ltr':
        targetLeftPos = this._firstOverflowedTabPos.left;
        break;
      case 'rtl':
        targetLeftPos = this._firstOverflowedTabPos.right - this._selectedTabPos.width;
        break;
    }
    const sourceLeftPos = this._selectedTabPos.left;
    const leftPos = targetLeftPos - sourceLeftPos;
    this._tabEls[this._overflowedSelectedTabIndex].style.transform = `translate(${leftPos}px,0px)`;
    return this;
  },
  _show: function (el) {
    el.style.transform = 'translate(0px,0px)';
    return this;
  },
  _checkTablistOverflow: function () {
    const els = this._tabEls,
      pos = els[els.length - 1].getBoundingClientRect();
    //factory
    return pos.right > this._sliderPos.right;
  },
  _setOverflowedSelectedTabFullWidth: function () {
    this._overflowedSelectedTabFullWidth =
      this._overflowedSelectedTabIndex >= 0 ? this._getElTotalWidth(this._tabEls[this._selectedTabIndex]) : 0;
    return this;
  },
  _setOverflowedTabIndexs: function () {
    this._overflowedTabIndexs = [];
    this._firstOverflowedTabPos = null;
    const els = this._tabEls;
    const _sliderRight = this._sliderPos.right;
    //factory
    const limitedRight = _sliderRight - this._moreBtnFullWidth - this._overflowedSelectedTabFullWidth;
    for (let i = 0; i < this.data.openTabIDs.length; i++) {
      if (i === this._selectedTabIndex) {
        continue;
      }
      const el = els[i],
        pos = el.getBoundingClientRect();
      if (pos.left > _sliderRight) {
        return this;
      }
      if (pos.right + parseFloat(getComputedStyle(el).marginRight) > limitedRight) {
        this._overflowedTabIndexs.push(i);
        this._firstOverflowedTabPos = this._firstOverflowedTabPos || pos;
      }
    }
    return this;
  },
  resize: function () {
    this._tabEls = this.tablistEl.childNodes;
    const {isVertical, direction} = this._api.optionsManager.options;
    this._dir = direction;
    // more-button should not work if isVertical option is true
    if (isVertical === true) {
      this._hideMoreBtn()._showOverflowedTabs();
      return;
    }
    requestAnimationFrame(() => {
      this._hideMoreBtn()._showOverflowedTabs()._resize();
    });
  },
  _resize: function () {
    this._sliderPos = this._getPos(this.sliderEl);
    if (this._checkTablistOverflow()) {
      this.data = this._api.getData();
      this._moreBtnFullWidth = this._getElTotalWidth(this.moreBtnsEl.current);
      this._selectedTabIndex = this.data.openTabIDs.indexOf(this.data.selectedTabID);
      this._selectedTabPos = this._getPos(this._tabEls[this._selectedTabIndex]);
      this._setOverflowedSelectedTabIndex()._setOverflowedSelectedTabFullWidth()._setOverflowedTabIndexs();
      if (this._overflowedTabIndexs.length) {
        this._hideOverflowedTabs();
        this._overflowedSelectedTabIndex > 0 && this._moveSelectedOverflowedTab();
        this._showMoreBtn();
      } else {
        throw new Error('when _checkTablistOverflow returns true, _overflowedTabIndexs can not be an empty array');
      }
    }
  },
});
export default MoreButton;
