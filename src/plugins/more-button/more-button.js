import React from 'react';
const MoreButton = function (resizeDetectorIns, ctx) {
  this.api = ctx;
  this.tablistEl = null;
  this.sliderEl = null;
  this.sliderPos = null;
  this.sliderStyle = null;
  this.isSelectedLastTab = false;
  this.isVertical = false;
  this.dir = 'right';
  this.Dir = 'Right';
  this.selectedTab = null;
  this.selectedTabIndex = -1;
  this.selectedTabPos = null;
  this.selectedTabStyle = null;
  this.selectedTabSize = 0;
  this.resizeDetectorIns = resizeDetectorIns;
  this.btnRef = React.createRef(null);
  this.btnSize = null;
  this.tabs = null;
  this.tabsLength = 0;
  this.setBtnCom();
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
  setIsVertical: function (ins) {
    this.isVertical = ins.getOption('isVertical');
    return this;
  },
  setdir: function (ins) {
    this.dir = this.isVertical ? 'bottom' : ins.getOption('direction') === 'ltr' ? 'right' : 'left';
    return this;
  },
  setDir: function (str) {
    this.Dir = str.charAt(0).toUpperCase() + str.slice(1);
  },
  setBtnCom: function () {
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
  getElHeight: function (elStyle, elPos) {
    return (
      elPos.height -
      parseFloat(elStyle.paddingTop) -
      parseFloat(elStyle.paddingBottom) -
      parseFloat(elStyle.borderBottomWidth) -
      parseFloat(elStyle.borderTopWidth)
    );
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
  getElSizeFactory(elStyle, elPos, fullSize) {
    fullSize = fullSize ? 'Full' : '';
    return this.isVertical
      ? this['getEl' + fullSize + 'Height'](elStyle, elPos)
      : this['getEl' + fullSize + 'Width'](elStyle, elPos);
  },
  getElFullWidth: function (elStyle, elPos) {
    return elPos.width + parseFloat(elStyle.marginLeft) + parseFloat(elStyle.marginRight);
  },
  getElFullHeight: function (elStyle, elPos) {
    return elPos.height + parseFloat(elStyle.marginTop) + parseFloat(elStyle.marginBottom);
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
    return this.calcDis(lastTabPos) <= 0;
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
  getSelectedTabSize: function () {
    this.selectedTabPos = this.selectedTabPos || this.getElPos(this.selectedTab);
    this.selectedTabStyle = this.selectedTabStyle || this.getElStyle(this.selectedTab);
    this.selectedTabSize =
      this.selectedTabSize || this.getElSizeFactory(this.selectedTabStyle, this.selectedTabPos, true);
    return this.selectedTabSize;
  },
  calcDisFactory: function (sliderDirPos, tabDirPos, sliderPadding, btnSize, selectedTabSize) {
    return this.dir === 'left'
      ? tabDirPos - sliderDirPos - sliderPadding - btnSize - selectedTabSize
      : sliderDirPos - tabDirPos - sliderPadding - btnSize - selectedTabSize;
  },
  calcDis: function (tabPos, countSelectedTab = false, countBtnSize = false) {
    return this.calcDisFactory(
      this.sliderPos[this.dir],
      tabPos[this.dir],
      parseFloat(this.sliderStyle['padding' + this.Dir]),
      countBtnSize ? this.btnSize : 0,
      countSelectedTab && this.selectedTab ? this.getSelectedTabSize() : 0,
    );
  },
  _reset: function () {
    this.selectedTabPos = null;
    this.selectedTabStyle = null;
    this.selectedTabSize = 0;
    return this;
  },
  resize: function () {
    const ins = this.api;
    const {openTabIDs} = ins.getData();
    this.tabsLength = openTabIDs.length;
    if (!this.tabsLength) {
      return;
    }
    this.setIsVertical(ins).setdir(ins).setDir(this.dir);
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
    this.btnSize = this.getElSizeFactory(
      this.getElStyle(this.btnRef.current),
      this.getElPos(this.btnRef.current),
      true,
    );
    this.setSelectedTab(this.selectedTabIndex);
    for (let i = 0, count = this.tabsLength - 2; i <= count; i++) {
      //check all tab's position except the last one
      if (i === this.selectedTabIndex) {
        //dont check selected tab
        continue;
      }
      const tabEl = this.tabs[i];
      const dis = this.calcDis(this.getElPos(tabEl), i < this.selectedTabIndex, true);
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
          this.getSelectedTabSize() + this.btnSize >= this.getElSizeFactory(this.sliderStyle, this.sliderPos);
      }
    }
    this.hideTabs(includeSelectedTab);
  },
});
export default MoreButton;
