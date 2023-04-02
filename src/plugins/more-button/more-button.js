import React from 'react';
import ElManagement from './elementManagement/index.js';
const MoreButton = function (resizeDetectorIns, ctx) {
  this.api = ctx;
  this.tablistEl = null;
  this.sliderEl = null;
  this.selectedTab = null;
  this.selectedTabIndex = -1;
  this.resizeDetectorIns = resizeDetectorIns;
  this.btnRef = React.createRef(null);
  this.tabs = null;
  this.tabsLength = 0;
  this.searchBoundries = [0, 0];
  this.lastTabDistance = null;
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
  setLastTabDistance: function () {
    this.lastTabDistance = this.els.getDistance(this.tabs[this.tabsLength - 1]).value;
    return this;
  },
  checkOverflow: function () {
    return this.lastTabDistance <= 0;
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
    this.firstHiddenTabIndex = -1;
    if (!this.tabsLength) {
      return;
    }
    this.els = new ElManagement({
      baseEl: this.sliderEl,
      isVertical: ins.getOption('isVertical'),
      dir: ins.getOption('direction'),
    });
    requestAnimationFrame(
      () =>
        this.setLastTabDistance().checkOverflow() &&
        (this.setSelectedTab(this.setSelectedTabIndex()).checkSliderMinSize().firstHiddenTabIndex >= 0
          ? this.hideTabs(true)
          : this.setFirstHiddenTabIndex().hideTabs()),
    );
    this.showAll(); //show all should be called regardless on overflow
  },
  checkSliderMinSize: function () {
    //the slider's size should contain selected tab + more button
    this.firstHiddenTabIndex =
      this.selectedTab &&
      this.els.getEl(this.selectedTab).getFullSize() + this.els.getEl(this.btnRef.current).getFullSize() >=
        this.els.getEl(this.sliderEl).getSize()
        ? 0
        : -1;
    return this;
  },
  setOrder: function () {
    return Math.abs(this.lastTabDistance) > this.els.getEl(this.sliderEl).getPos().width ? 'asc' : 'desc';
  },
  setSearchBoundries: function (pivotIndex) {
    if (!(pivotIndex >= 0)) {
      this.searchBoundries = [0, pivotIndex - 2];
      return this;
    }
    const isPivotOverflow =
      this.els.getDistance(this.tabs[pivotIndex]).sub(this.els.getEl(this.btnRef.current).getFullSize()).value <= 0;
    if (isPivotOverflow) {
      this.searchBoundries = [0, pivotIndex - 1];
    } else {
      this.searchBoundries = [pivotIndex + 1, this.tabsLength - 2];
    }
    return this;
  },
  _loop: function (startIndex, stopIndex, order, shouldBreakCallback) {
    if (order == 'asc') {
      for (let i = startIndex; i <= stopIndex; i++) {
        if (shouldBreakCallback(i) == true) {
          break;
        }
      }
    } else
      for (let i = stopIndex; i >= startIndex; i--) {
        if (shouldBreakCallback(i) == true) {
          break;
        }
      }
  },
  getTabDistanceFactory: function (isSelectedTabOverflow) {
    this.getTabDistance = isSelectedTabOverflow
      ? (el) =>
          this.els
            .getDistance(el)
            .sub(this.els.getEl(this.selectedTab).getFullSize())
            .sub(this.els.getEl(this.btnRef.current).getFullSize())
      : (el) => this.els.getDistance(el).sub(this.els.getEl(this.btnRef.current).getFullSize());
    return this;
  },
  updateFirstHiddenTabIndexFactory: function (order) {
    this.updateFirstHiddenTabIndex =
      order === 'asc'
        ? (tabIndex) => {
            if (this.getTabDistance(this.tabs[tabIndex]).value <= 0) {
              this.firstHiddenTabIndex = tabIndex;
              return true;
            } else {
              return false;
            }
          }
        : (tabIndex) => {
            if (this.getTabDistance(this.tabs[tabIndex]).value <= 0) {
              this.firstHiddenTabIndex = tabIndex;
              return false;
            } else {
              return true;
            }
          };
    return this;
  },
  setFirstHiddenTabIndex: function () {
    this.firstHiddenTabIndex = this.tabsLength - 1;
    const [start, stop] = this.searchBoundries;
    const order = this.setOrder();
    this.setSearchBoundries(this.selectedTabIndex)
      .getTabDistanceFactory(start == 0)
      .updateFirstHiddenTabIndexFactory(order)
      ._loop(start, stop, order, this.updateFirstHiddenTabIndex);
    return this;
  },
});
export default MoreButton;
