const Api = function ({getElManagementIns, btnRef, ctx, setHiddenTabIDs}) {
  this.api = ctx;
  this.tablistEl = null;
  this.getElManagementIns = getElManagementIns;
  this.sliderEl = null;
  this.tabs = null;
  this.tabsCount = null;
  this.btnRef = btnRef;
  this.resize = this.resize.bind(this);
  this._setHiddenTabIDs = setHiddenTabIDs;
  this.btnStyle = {
    minWidth: '46.38px',
    minHeight: '16px',
    margin: '0px 2px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  };
  //ctx.on('onChange',)
};
Object.assign(Api.prototype, {
  installResizer: function (resizeDetectorIns) {
    this.tablistEl = this.api.tablistRef.current;
    this.sliderEl = this.tablistEl.parentElement.parentElement;
    this.tablistEl.style.overflow = 'visible';
    this.sliderEl.style.overflow = 'hidden';
    resizeDetectorIns.listenTo(
      this.sliderEl,
      (function (func, wait) {
        let timeout;
        return function (...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      })(this.resize, 10),
    );
  },
  uninstallResizer: function (resizeDetectorIns) {
    if (this.sliderEl && resizeDetectorIns) resizeDetectorIns.uninstall(this.sliderEl);
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
  showAll: function () {
    this.tablistEl.style.display = 'none';
    for (let i = 0, tabs = this.tablistEl.children, tabsCount = tabs.length; i < tabsCount; i++) {
      tabs[i].style.display = 'flex';
    }
    this.hideBtn();
    this.tablistEl.style.display = 'flex';
  },
  hideTabs: function (firstHiddenTabIndex, selectedTabInfo, includeSelectedTab) {
    const {openTabIDs} = this.api.getData();
    const hiddenTabIDs = [];
    this.tablistEl.style.display = 'none';
    const {index: selectedTabIndex} = selectedTabInfo;
    for (let i = firstHiddenTabIndex, tabsCount = this.tabsCount; i < tabsCount; i++) {
      if (includeSelectedTab || i !== selectedTabIndex) {
        this.tabs[i].style.display = 'none';
        hiddenTabIDs.push(openTabIDs[i]);
      }
    }
    this.showBtn();
    this.tablistEl.style.display = 'flex';
    this._setHiddenTabIDs(hiddenTabIDs.toString());
  },
  getSelectedTab: function (tabs, data) {
    const {openTabIDs, selectedTabID} = data;
    const index = openTabIDs.indexOf(selectedTabID);
    const el = index >= 0 ? tabs[index] : null;
    const overflow = el
      ? this.els.getDistance(el).sub(this.els.getEl(this.btnRef.current).getFullSize()).value <= 0
      : false;
    const fullSize = overflow ? this.els.getEl(el).getFullSize() : 0;
    return {index, el, overflow, fullSize};
  },
  validateTabsCount: function (data) {
    const openTabsCount = data.openTabIDs.length;
    if (!openTabsCount) {
      return false;
    }
    this.tabs = this.tablistEl.children;
    this.tabsCount = this.tabs.length;
    if (openTabsCount !== this.tabsCount) {
      throw new Error("tablist children's count is not equal to open tabs count");
    }
    return true;
  },
  _resize: function () {
    const ins = this.api;
    const data = ins.getData();
    if (this.validateTabsCount(data) === false) {
      return;
    }
    this.showAll(); //showAll should be called regardless of overflow
    this.els = this.getElManagementIns({
      baseEl: this.sliderEl,
      isVertical: ins.getOption('isVertical'),
      dir: ins.getOption('direction'),
    });
    const _lastTab = this.tabs[this.tabsCount - 1];
    if (this.checkOverflow(_lastTab) === false) {
      return this._setHiddenTabIDs('');
    }
    const selectedTabInfo = this.getSelectedTab(this.tabs, data);
    this.validateSliderMinSize(selectedTabInfo)
      ? this.hideTabs(
          this.findFirstHiddenTabIndexFactory(
            selectedTabInfo,
            this.getSearchBoundries(selectedTabInfo),
            this.getOrder(_lastTab),
          ),
          selectedTabInfo,
        )
      : this.hideTabs(0, selectedTabInfo, true);
  },
  resize: function () {
    requestAnimationFrame(this._resize.bind(this));
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
  getSearchBoundries: function (selectedTabInfo) {
    const {overflow, index: pivotIndex} = selectedTabInfo;
    if (pivotIndex < 0) {
      return [0, this.tabsCount - 2];
    }
    return overflow ? [0, pivotIndex - 1] : [pivotIndex + 1, this.tabsCount - 2];
  },
  getTabDis: function (selectedTabInfo, el) {
    return this.els
      .getDistance(el)
      .sub(selectedTabInfo.fullSize)
      .sub(this.els.getEl(this.btnRef.current).getFullSize());
  },
  findFirstHiddenTabIndexDSCE: function (selectedTabInfo, start, stop) {
    let value = this.tabsCount - 1;
    for (let i = stop; i >= start; i--) {
      if (this.getTabDis(selectedTabInfo, this.tabs[i]).value <= 0) {
        value = i;
      } else {
        break;
      }
    }
    return value;
  },
  findFirstHiddenTabIndexASC: function (selectedTabInfo, start, stop) {
    for (let i = start; i <= stop; i++) {
      if (this.getTabDis(selectedTabInfo, this.tabs[i]).value <= 0) {
        return i;
      }
    }
    return this.tabsCount - 1;
  },
  findFirstHiddenTabIndexFactory: function (selectedTabInfo, [start, stop], order) {
    return order === 'asc'
      ? this.findFirstHiddenTabIndexASC(selectedTabInfo, start, stop)
      : this.findFirstHiddenTabIndexDSCE(selectedTabInfo, start, stop);
  },
});
export default Api;
