import React from 'react';
import ElManagement from './elementManagement/index.js';
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
  checkOverflow: function () {
    return this.els.getDistance(this.tabs[this.tabsLength - 1]).value <= 0;
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
  resize: function () {
    const ins = this.api;
    const {openTabIDs} = ins.getData();
    this.tabsLength = openTabIDs.length;
    if (!this.tabsLength) {
      return;
    }
    this.els = new ElManagement({
      baseEl: this.sliderEl,
      isVertical: ins.getOption('isVertical'),
      dir: ins.getOption('direction'),
    });
    requestAnimationFrame(() => {
      this._resize();
    });
    this.showAll(); //show all should be called regardless on overflow
  },
  _resize: function () {
    if (this.checkOverflow() === false) {
      return;
    }
    this.firstHiddenTabIndex = this.tabsLength - 1;
    this.setSelectedTab(this.setSelectedTabIndex());
    for (let i = 0, count = this.tabsLength - 2; i <= count; i++) {
      //check all tab's position except the last one
      if (i === this.selectedTabIndex) {
        //dont check selected tab
        continue;
      }
      const _dis = this.els.getDistance(this.tabs[i]);
      if (i < this.selectedTabIndex) {
        _dis.sub(this.els.getEl(this.selectedTab).getFullSize());
      }
      _dis.sub(this.els.getEl(this.btnRef.current).getFullSize());
      if (_dis.value <= 0) {
        this.firstHiddenTabIndex = i;
        break;
      }
    }
    let includeSelectedTab = false;
    //check if all tabs including selectedTab should be hidden then hide selectedTab
    if (this.selectedTab != null) {
      if (this.firstHiddenTabIndex <= 0 || (this.firstHiddenTabIndex === 1 && this.selectedTabIndex === 0)) {
        includeSelectedTab =
          this.els.getEl(this.selectedTab).getFullSize() + this.els.getEl(this.btnRef.current).getFullSize() >=
          this.els.getEl(this.sliderEl).getSize();
      }
    }
    this.hideTabs(includeSelectedTab);
  },
});
export default MoreButton;
