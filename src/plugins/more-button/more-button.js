import React from 'react';
const MoreButton = function (resizeDetectorIns, ctx) {
  this._api = ctx;
  this._data = null;
  this._overflowedTabID = '';
  this._overflowedSelectedTabID = '';
  this._viewportTabsWidth = null;
  this._dir = '';
  this._btnPos = null;
  this._tablistPos = null;
  this._selectedTabPos = null;
  this.isBtnVisible = false;
  this.resizeDetectorIns = resizeDetectorIns;
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
    const el = this.moreBtnsEl.current;
    el.style.transform = 'translate(-170px,-50%)';
  },
  _showMoreBtn: function (left) {
    const el = this.moreBtnsEl.current;
    el.style.transform = `translate(${left}px,-50%)`;
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
  _getElTotalWidth: function (element) {
    const style = element.currentStyle || window.getComputedStyle(element),
      width = element.offsetWidth, // or use style.width
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    //padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
    //border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    return width + margin;
  },
  _hide: function (el) {
    el.style.transform = 'translate(0px,200px)';
  },
  _show: function (el) {
    el.style.transform = 'translate(0px,0px)';
  },
  _loop: function (arr, startIndex, stopIndex, callback) {
    for (let i = startIndex; i < stopIndex; i++) {
      callback(arr[i], i);
    }
  },
  _checkTablistOverflow: function (sliderWidth) {
    return sliderWidth < this.sliderEl.scrollWidth;
  },
  _setFirstHiddenChildIndex: function (
    selectedTabIndex,
    tablist,
    tablistLength,
    sliderWidth,
    selectedTabWidth,
    moreBtnWidth,
  ) {
    let totalTabsWidth = 0,
      right;
    const availableWidth = sliderWidth - selectedTabWidth - moreBtnWidth - 5;
    for (let i = 0; i < tablistLength; i++) {
      // if is selected
      if (i === selectedTabIndex) {
        continue;
      }
      const elWidth = this._getElTotalWidth(tablist[i]);
      if (elWidth + totalTabsWidth > availableWidth) {
        this._showMoreBtn(this._calculateMoreBtnXPos(totalTabsWidth, selectedTabWidth, moreBtnWidth, sliderWidth));
        return [i, totalTabsWidth, right];
      } else {
        totalTabsWidth += elWidth;
        right = tablist[i].getBoundingClientRect().right;
      }
    }
    return [-1, totalTabsWidth, right];
  },
  resize: function () {
    // more-button should not work if isVertical option is true
    if (this._api.getOption('isVertical')) {
      return;
    }
    const {selectedTabID, openTabIDs} = this._api.getData();
    this._resize(this.tablistEl.childNodes, openTabIDs.length, openTabIDs.indexOf(selectedTabID));
  },
  _resize: function (tabEls, tabsCount, selectedTabIndex) {
    requestAnimationFrame(() => {
      // check if there is a hidden tab previously
      this._loop(tabEls, 0, tabsCount, (tab) => {
        this._show(tab);
      });
      const sliderWidth = this.sliderEl.clientWidth,
        selectedTabWidth = this._getElTotalWidth(tabEls[selectedTabIndex]),
        moreBtnWidth = this._getElTotalWidth(this.moreBtnsEl.current);
      if (this._checkTablistOverflow(sliderWidth)) {
        const [_firstHiddenChildIndex, totalTabsWidth, right] = this._setFirstHiddenChildIndex(
          selectedTabIndex,
          tabEls,
          tabsCount,
          sliderWidth,
          selectedTabWidth,
          moreBtnWidth,
        );
        if (_firstHiddenChildIndex !== -1) {
          this._loop(tabEls, _firstHiddenChildIndex, tabsCount, (tab, i) => {
            if (i === selectedTabIndex) {
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
    });
  },
});
export default MoreButton;
