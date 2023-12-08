const Api = function ({getElManagementIns, btnRef, ctx, setHiddenTabIDs}) {
  this.api = ctx;
  this.tablistEl = null;
  this.getElManagementIns = getElManagementIns;
  this.tablistContainerEl = null;
  this.tabs = null;
  this.tabsCount = null;
  this.btnRef = btnRef;
  this._setHiddenTabIDs = setHiddenTabIDs;
};
Object.assign(Api.prototype, {
  installResizer: function (resizeDetectorIns) {
    this.tablistEl = this.api.tablistRef.current;
    this.tablistContainerEl = this.tablistEl.parentElement.parentElement;
    this.tablistViewEl = this.tablistContainerEl.parentElement;
    this.tablistEl.style.overflow = 'visible';
    this.raf = this.raf || window.requestAnimationFrame || ((callback) => callback());
    this.tablistContainerEl.style.overflow = 'hidden';
    resizeDetectorIns.debncListenTo(this.tablistViewEl, () => this.raf(() => this.resize()));
  },
  uninstallResizer: function (resizeDetectorIns) {
    if (this.tablistViewEl && resizeDetectorIns) resizeDetectorIns.uninstall(this.tablistViewEl);
  },
  showBtn: function () {
    this.btnRef.current.style.opacity = 1;
    this.btnRef.current.style.position = 'relative';
    this.btnRef.current.style.pointerEvents = 'all';
  },
  hideBtn: function () {
    this.btnRef.current.style.opacity = 0;
    this.btnRef.current.style.position = 'absolute';
    this.btnRef.current.style.pointerEvents = 'none';
  },
  checkOverflow: function (lastTab) {
    return this.els.getDistance(lastTab).value < 0;
  },
  showAll: function () {
    this.tablistContainerEl.style.display = 'none';
    for (let i = 0, tabs = this.tablistEl.children, tabsCount = tabs.length; i < tabsCount; i++) {
      tabs[i].style.display = 'flex';
    }
    this.hideBtn();
    this.tablistContainerEl.style.display = 'flex';
  },
  hideTabs: function (firstHiddenTabIndex, selectedTabInfo, includeSelectedTab) {
    const {openTabIDs} = this.api.getData();
    const hiddenTabIDs = [];
    this.tablistContainerEl.style.display = 'none';
    const {index: selectedTabIndex} = selectedTabInfo;
    for (let i = firstHiddenTabIndex, tabsCount = this.tabsCount; i < tabsCount; i++) {
      if (includeSelectedTab || i !== selectedTabIndex) {
        this.tabs[i].style.display = 'none';
        hiddenTabIDs.push(openTabIDs[i]);
      }
    }
    this.showBtn();
    this.tablistContainerEl.style.display = 'flex';
    this._setHiddenTabIDs(hiddenTabIDs.toString());
  },
  getSelectedTabInfo: function (tabs, data) {
    const {openTabIDs, selectedTabID} = data;
    const index = openTabIDs.indexOf(selectedTabID);
    const el = index >= 0 ? tabs[index] : null;
    const overflow = el
      ? this.els.getDistance(el).sub(this.els.getEl(this.btnRef.current).getFullSize()).value <= 0
      : false;
    const overflowFullSize = overflow ? this.els.getEl(el).getFullSize() : 0;
    return {index, overflowFullSize};
  },
  validateTabsCount: function (data) {
    const openTabsCount = data.openTabIDs.length;
    if (!openTabsCount) {
      return false;
    }
    this.tabs = this.tablistEl.children;
    this.tabsCount = this.tabs.length;
    if (openTabsCount !== this.tabsCount) {
      throw new Error("tablist children's length is not equal to openTabIDs length");
    }
    return true;
  },
  resize: function () {
    const ins = this.api;
    const data = ins.getData();
    if (this.validateTabsCount(data) === false) {
      return;
    }
    this.showAll(); //showAll should be called regardless of overflow
    this.els = this.getElManagementIns({
      baseEl: this.tablistContainerEl,
      isVertical: ins.getOption('isVertical'),
      dir: ins.getOption('direction'),
    });
    const _lastTab = this.tabs[this.tabsCount - 1];
    if (this.checkOverflow(_lastTab) === false) {
      return this._setHiddenTabIDs('');
    }
    const selectedTabInfo = this.getSelectedTabInfo(this.tabs, data);
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
  validateSliderMinSize: function (selectedTabInfo) {
    //the slider's size should greater than size of selected tab + more button
    return selectedTabInfo.overflowFullSize + this.els.getEl(this.btnRef.current).getFullSize() >=
      this.els.getEl(this.tablistContainerEl).getSize()
      ? false
      : true;
  },
  getOrder: function (lastTab) {
    return Math.abs(this.els.getDistance(lastTab).value) > this.els.getEl(this.tablistContainerEl).getSize()
      ? 'asc'
      : 'desc';
  },
  getSearchBoundries: function (selectedTabInfo) {
    const {overflowFullSize, index: pivotIndex} = selectedTabInfo;
    //if selected tab is not existed
    if (pivotIndex < 0) {
      return [0, this.tabsCount - 2];
    }
    const isSelectedTabOverflow = overflowFullSize > 0;
    return isSelectedTabOverflow ? [0, pivotIndex - 1] : [pivotIndex + 1, this.tabsCount - 2];
  },
  getTabDis: function (selectedTabInfo, el) {
    return this.els
      .getDistance(el)
      .sub(selectedTabInfo.overflowFullSize)
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
