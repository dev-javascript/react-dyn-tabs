const Api = function ({getResizerIns, btnRef, ctx, setHiddenTabIDs}) {
  this.api = ctx;
  this.tablistEl = null;
  this.getResizerIns = getResizerIns;
  this.tablistContainerEl = null;
  this.tabs = null;
  this.tabsCount = null;
  this.btnRef = btnRef;
  this._setHiddenTabIDs = setHiddenTabIDs;
};
Object.assign(Api.prototype, {
  setResizer: function () {
    this.tablistEl = this.btnRef.current.previousSibling;
    this.tablistContainerEl = this.tablistEl.parentElement.parentElement;
    this.tablistViewEl = this.tablistContainerEl.parentElement;
    this._resizer = this.getResizerIns({
      containerElement: this.tablistContainerEl,
      buttonElement: this.btnRef.current,
      tablistElement: this.tablistEl,
    });
  },
  installResizer: function (resizeDetectorIns) {
    resizeDetectorIns.debncListenTo(this.tablistViewEl, () => this.resize());
  },
  uninstallResizer: function (resizeDetectorIns) {
    if (this.tablistViewEl && resizeDetectorIns) resizeDetectorIns.uninstall(this.tablistViewEl);
  },
  _validateTabsCount: function (data) {
    this.tabs = this.tablistEl.children;
    this.tabsCount = this.tabs.length;
    if (data.openTabIDs.length !== this.tabsCount) {
      throw new Error("tablist children's length is not equal to openTabIDs length");
    }
    return true;
  },
  resize: function () {
    const ins = this.api;
    const data = ins.getData();
    if (this._validateTabsCount(data) === false) {
      return this._setHiddenTabIDs('');
    }
    const {openTabIDs, selectedTabID} = data;
    const selectedTabIndex = openTabIDs.indexOf(selectedTabID);
    const hiddenTabs = this._resizer.resize(selectedTabIndex, ins.getOption('direction'), ins.getOption('isVertical'));
    if (!hiddenTabs.length) {
      return this._setHiddenTabIDs('');
    }
    this._setHiddenTabIDs(hiddenTabs.map(({index}) => openTabIDs[index]).toString());
  },
});
export default Api;
