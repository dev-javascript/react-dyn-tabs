import React from 'react';
const MoreButton = function (resizeDetectorIns, ctx) {
  this.api = ctx;
  this.tablistEl = null;
  this.sliderEl = null;
  this.sliderPos = null;
  this.sliderStyle = null;
  this.isSelectedLastTab = false;
  this.selectedTab = null;
  this.selectedTabIndex = -1;
  this.selectedTabPos = null;
  this.selectedTabStyle = null;
  this.selectedTabWidth = 0;
  this.resizeDetectorIns = resizeDetectorIns;
  this.btnRef = React.createRef(null);
  this.btnWidth = null;
  this.tabs = null;
  this.tabsLength = 0;
  this.setMoreBtnsCom();
  this.firstHiddenTabIndex = -1;
  this.resize = this.resize.bind(this);
  ctx.userProxy.resize = () => {
    this.resize();
  };
  const resize = (function (func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  })(this.resize, 10);
  const that = this;
  ctx
    .on('_beforeLoad', () => {
      that.tablistEl = ctx.tablistRef.current;
      that.tablistEl.style.overflow = 'visible';
      that.sliderEl = that.tablistEl.parentElement;
      that.sliderEl.style.overflow = 'hidden';
      that.tabs = that.tablistEl.childNodes;
      that.resizeDetectorIns.listenTo(that.sliderEl, resize);
    })
    .on('onDestroy', () => {
      that.destroy();
    });
};
Object.assign(MoreButton.prototype, {
  setMoreBtnsCom: function () {
    const that = this;
    const _style = {
      minWidth: '46.38px',
      minHeight: '16px',
      margin: '0px 2px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
    };
    this.api.optionsManager.setting.MoreButtonComponent = function MoreButtonComponent() {
      return (
        <button ref={that.btnRef} value="more" style={_style}>
          more
        </button>
      );
    };
    return this;
  },
  destroy: function () {
    if (this.sliderEl && this.resizeDetectorIns) this.resizeDetectorIns.uninstall(this.sliderEl);
  },
  showBtn: function () {
    this.btnRef.current.style.opacity = 1;
  },
  hideBtn: function () {
    this.btnRef.current.style.opacity = 0;
  },
  setSelectedTab: function (i) {
    this.selectedTab = i >= 0 ? this.tabs[i] : null;
    return this;
  },
  setSelectedTabIndex: function () {
    const {openTabIDs, selectedTabID} = this.api.getData();
    this.selectedTabIndex = openTabIDs.indexOf(selectedTabID);
    return this.selectedTabIndex;
  },
  setIsSelectedLastTab: function () {
    this.isSelectedLastTab = this.selectedTabIndex === this.tabsLength - 1;
  },
  getElWidth: function (elStyle, elPos) {
    return (
      elPos.width -
      parseFloat(elStyle.paddingLeft) -
      parseFloat(elStyle.paddingRight) -
      parseFloat(elStyle.borderRightWidth) -
      parseFloat(elStyle.borderLeftWidth)
    );
  },
  getElFullWidth: function (elStyle, elPos) {
    return elPos.width + parseFloat(elStyle.marginLeft) + parseFloat(elStyle.marginRight);
  },
  getElPos: function (el) {
    return el.getBoundingClientRect();
  },
  getElStyle: function (el) {
    return el.currentStyle || window.getComputedStyle(el);
  },
  checkOverflow: function () {
    const lastTabPos = this.getElPos(this.tabs[this.tabsLength - 1]);
    if (this.isSelectedLastTab) {
      this.selectedTabPos = lastTabPos;
    }
    return this.sliderPos.right - parseFloat(this.sliderStyle.paddingRight) - lastTabPos.right <= 0;
  },
  showAll: function () {
    this.tablistEl.style.display = 'none';
    for (let i = 0; i < this.tabsLength; i++) {
      this.tabs[i].style.display = 'flex';
    }
    this.hideBtn();
    this.tablistEl.style.display = 'flex';
  },
  hideTabs: function (includeSelectedTab) {
    this.tablistEl.style.display = 'none';
    const selectedTabIndex = this.selectedTabIndex;
    for (let i = this.firstHiddenTabIndex, count = this.tabsLength; i < count; i++) {
      if (i !== selectedTabIndex) {
        this.tabs[i].style.display = 'none';
      }
    }
    if (includeSelectedTab) {
      this.selectedTab.style.display = 'none';
    }
    this.showBtn();
    this.tablistEl.style.display = 'flex';
  },
  getSelectedTabWidth: function () {
    this.selectedTabPos = this.selectedTabPos || this.getElPos(this.selectedTab);
    this.selectedTabStyle = this.selectedTabStyle || this.getElStyle(this.selectedTab);
    this.selectedTabWidth = this.selectedTabWidth || this.getElFullWidth(this.selectedTabStyle, this.selectedTabPos);
    return this.selectedTabWidth;
  },
  calcDis: function (pos, countSelectedTab) {
    if (countSelectedTab && this.selectedTab) {
      return (
        this.sliderPos.right -
        parseFloat(this.sliderStyle.paddingRight) -
        pos.right -
        this.btnWidth -
        this.getSelectedTabWidth()
      );
    } else {
      return this.sliderPos.right - parseFloat(this.sliderStyle.paddingRight) - pos.right - this.btnWidth;
    }
  },
  _reset: function () {
    this.selectedTabPos = null;
    this.selectedTabStyle = null;
    this.selectedTabWidth = 0;
    return this;
  },
  resize: function () {
    const {openTabIDs} = this.api.getData();
    this.tabsLength = openTabIDs.length;
    if (!this.tabsLength) {
      return;
    }
    requestAnimationFrame(() => {
      this._resize();
    });
    this._reset().showAll(); //show all should be called regardless on overflow
  },
  _resize: function () {
    this.sliderPos = this.getElPos(this.sliderEl);
    this.sliderStyle = this.getElStyle(this.sliderEl);
    this.setSelectedTabIndex();
    this.setIsSelectedLastTab();
    if (this.checkOverflow() === false) {
      return;
    }
    this.firstHiddenTabIndex = this.tabsLength - 1;
    this.btnWidth = this.getElFullWidth(this.getElStyle(this.btnRef.current), this.getElPos(this.btnRef.current));
    this.setSelectedTab(this.selectedTabIndex);
    for (let i = 0, count = this.tabsLength - 2; i <= count; i++) {
      //check all tab's position except the last one
      if (i === this.selectedTabIndex) {
        //dont check selected tab
        continue;
      }
      const tabEl = this.tabs[i];
      const dis = this.calcDis(this.getElPos(tabEl), i < this.selectedTabIndex);
      if (dis <= 0) {
        this.firstHiddenTabIndex = i;
        break;
      }
    }
    let includeSelectedTab = false;
    //check if all tabs including selectedTab should be hidden then hide selectedTab
    if (this.selectedTab != null) {
      if (this.firstHiddenTabIndex <= 0 || (this.firstHiddenTabIndex === 1 && this.selectedTabIndex === 0)) {
        includeSelectedTab =
          this.getSelectedTabWidth() + this.btnWidth >= this.getElWidth(this.sliderStyle, this.sliderPos);
      }
    }
    this.hideTabs(includeSelectedTab);
  },
});
export default MoreButton;
