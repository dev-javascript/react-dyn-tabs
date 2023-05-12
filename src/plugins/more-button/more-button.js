import React from 'react';
import ElManagement from './elementManagement/index.js';
const MoreButton = function (resizeDetectorIns, ctx) {
  this.api = ctx;
  this.tablistEl = null;
  this.sliderEl = null;
  this.resizeDetectorIns = resizeDetectorIns;
  this.btnRef = React.createRef(null);
  this.tabs = null;
  this.setBtnCom();
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
  checkOverflow: function (lastTab) {
    return this.els.getDistance(lastTab).value <= 0;
  },
  showAll: function (tabsLength) {
    this.tablistEl.style.display = 'none';
    for (let i = 0; i < tabsLength; i++) {
      this.tabs[i].style.display = 'flex';
    }
    this.hideBtn();
    this.tablistEl.style.display = 'flex';
  },
  hideTabs: function (firstHiddenTabIndex, selectedTabInfo, tabsLength, includeSelectedTab) {
    this.tablistEl.style.display = 'none';
    const {index, el} = selectedTabInfo;
    for (let i = firstHiddenTabIndex; i < tabsLength; i++) {
      if (i !== index) {
        this.tabs[i].style.display = 'none';
      }
    }
    if (includeSelectedTab) {
      el.style.display = 'none';
    }
    this.showBtn();
    this.tablistEl.style.display = 'flex';
  },
  setSelectedTab: function (tabs, data) {
    const {openTabIDs, selectedTabID} = data;
    const index = openTabIDs.indexOf(selectedTabID);
    const el = index >= 0 ? tabs[index] : null;
    const overflow = el
      ? this.els.getDistance(el).sub(this.els.getEl(this.btnRef.current).getFullSize()).value <= 0
      : false;
    const fullSize = overflow ? this.els.getEl(el).getFullSize() : 0;
    this._selectedTab = {index, el, overflow, fullSize};
    return this;
  },
  getSelectedTab: function () {
    return this._selectedTab;
  },
  resize: function () {
    const ins = this.api;
    const data = ins.getData();
    const _tabsLength = data.openTabIDs.length;
    if (!_tabsLength) {
      return;
    }
    const _lastTab = this.tabs[_tabsLength - 1];
    this.els = new ElManagement({
      baseEl: this.sliderEl,
      isVertical: ins.getOption('isVertical'),
      dir: ins.getOption('direction'),
    });
    requestAnimationFrame(
      () =>
        this.checkOverflow(_lastTab) &&
        (this.setSelectedTab(this.tabs, data).validateSliderMinSize(this.getSelectedTab())
          ? this.hideTabs(
              this.findFirstHiddenTabIndexFactory(
                this.getSearchBoundries(_tabsLength),
                this.getOrder(_lastTab),
                _tabsLength,
              ),
              this.getSelectedTab(),
              _tabsLength,
            )
          : this.hideTabs(0, this.getSelectedTab(), _tabsLength, true)),
    );
    this.showAll(_tabsLength); //showAll should be called regardless of overflow
  },
  validateSliderMinSize: function (selectedTabInfo) {
    const {el, fullSize} = selectedTabInfo;
    //the slider's size should contain selected tab + more button
    return el && fullSize + this.els.getEl(this.btnRef.current).getFullSize() >= this.els.getEl(this.sliderEl).getSize()
      ? false
      : true;
  },
  getOrder: function (lastTab) {
    return Math.abs(this.els.getDistance(lastTab).value) > this.els.getEl(this.sliderEl).getPos().width
      ? 'asc'
      : 'desc';
  },
  getSearchBoundries: function (tabsLength) {
    const {overflow, index: pivotIndex} = this.getSelectedTab();
    if (pivotIndex < 0) {
      return [0, tabsLength - 2];
    }
    return overflow ? [0, pivotIndex - 1] : [pivotIndex + 1, tabsLength - 2];
  },
  getTabDis: function (el) {
    return this.els
      .getDistance(el)
      .sub(this.getSelectedTab().fullSize)
      .sub(this.els.getEl(this.btnRef.current).getFullSize());
  },
  findFirstHiddenTabIndexDSCE: function (start, stop, tabsLength) {
    let firstHiddenTabIndex = tabsLength - 1;
    for (let i = stop; i >= start; i--) {
      if (this.getTabDis(this.tabs[i]).value <= 0) {
        firstHiddenTabIndex = i;
      } else {
        break;
      }
    }
    return firstHiddenTabIndex;
  },
  findFirstHiddenTabIndexASC: function (start, stop, tabsLength) {
    for (let i = start; i <= stop; i++) {
      if (this.getTabDis(this.tabs[i]).value <= 0) {
        return i;
      }
    }
    return tabsLength - 1;
  },
  findFirstHiddenTabIndexFactory: function ([start, stop], order, tabsLength) {
    return order === 'asc'
      ? this.findFirstHiddenTabIndexASC(start, stop, tabsLength)
      : this.findFirstHiddenTabIndexDSCE(start, stop, tabsLength);
  },
});
export default MoreButton;
