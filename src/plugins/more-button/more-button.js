import React from 'react';
const MoreButton = function (resizeDetectorIns, ctx) {
  if (ctx.getOption('isVertical')) {
    return;
  }
  this.api = ctx;
  this.resizeDetectorIns = resizeDetectorIns;
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
      transform: 'translateY(-50%)',
      minWidth: '16px',
      minHeight: '16px',
      display: 'none',
      justifyContent: 'center',
      alignItems: 'center',
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
    el.style.display = 'none';
  },
  _showMoreBtn: function ([left, right]) {
    const el = this.moreBtnsEl.current;
    el.style.left = left;
    el.style.right = right;
    el.style.display = 'flex';
  },
  _calculateMoreBtnXPos: function (totalTabsWidth, selectedTabWidth, moreBtnWidth, sliderWidth) {
    let xPos;
    if (this.api.getOption('direction') === 'ltr') {
      xPos = totalTabsWidth + selectedTabWidth + 5;
      xPos = xPos > sliderWidth - moreBtnWidth ? sliderWidth - moreBtnWidth - 5 : xPos;
      return [xPos + 'px', 'auto'];
    } else {
      xPos = totalTabsWidth + selectedTabWidth + 5;
      xPos = xPos > sliderWidth - moreBtnWidth ? sliderWidth - moreBtnWidth - 5 : xPos;
      return ['auto', xPos + 'px'];
      // xPos = sliderWidth - totalTabsWidth - selectedTabWidth - moreBtnWidth - 5;
      // return xPos < 0 ? sliderWidth - moreBtnWidth - 5 : xPos;
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
    el.classList.add(this.hiddenClass);
  },
  _show: function (el) {
    el.classList.remove(this.hiddenClass);
  },
  _changeTabsStyle: function (tabs, startIndex, stopIndex, actionCallback, endCallback = () => {}) {
    const {tablistEl} = this;
    this._hide(tablistEl);
    for (let i = startIndex; i < stopIndex; i++) {
      actionCallback(tabs[i], i);
    }
    endCallback();
    this._show(tablistEl);
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
    let totalTabsWidth = 0;
    const availableWidth = sliderWidth - selectedTabWidth - moreBtnWidth - 5;
    for (let i = 0; i < tablistLength; i++) {
      // if is selected
      if (i === selectedTabIndex) {
        continue;
      }
      const elWidth = this._getElTotalWidth(tablist[i]);
      if (elWidth + totalTabsWidth > availableWidth) {
        return [i, totalTabsWidth];
      } else {
        totalTabsWidth += elWidth;
      }
    }
    return [-1, totalTabsWidth];
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
    requestAnimationFrame(() => {
      // check if there is a hidden tab previously
      this._changeTabsStyle(tabEls, 0, tabsCount, (tab) => {
        this._show(tab);
      });
      const sliderWidth = this.sliderEl.clientWidth,
        selectedTabWidth = this._getElTotalWidth(tabEls[selectedTabIndex]),
        moreBtnWidth = this._getElTotalWidth(this.moreBtnsEl.current);
      if (this._checkTablistOverflow(sliderWidth)) {
        const [_firstHiddenChildIndex, totalTabsWidth] = this._setFirstHiddenChildIndex(
          selectedTabIndex,
          tabEls,
          tabsCount,
          sliderWidth,
          selectedTabWidth,
          moreBtnWidth,
        );
        if (_firstHiddenChildIndex !== -1) {
          this._changeTabsStyle(
            tabEls,
            _firstHiddenChildIndex,
            tabsCount,
            (tab, i) => {
              if (i !== selectedTabIndex) this._hide(tab);
            },
            () => {
              this._showMoreBtn(
                this._calculateMoreBtnXPos(totalTabsWidth, selectedTabWidth, moreBtnWidth, sliderWidth),
              );
            },
          );
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
