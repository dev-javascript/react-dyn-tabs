import React from 'react';
import Helper from '../../helper.js';
const {throwMissingParam: missingParamEr} = Helper;
function OptionManager(getDeps, {options}) {
  const {globalDefaultOptions} = getDeps();
  this._defaultOptions = globalDefaultOptions;
  this._validateOptions(options);
  this.options = Object.assign({}, this._defaultOptions, options);
  this.setting = {};
  this.initialState = {};
  this.initialTabs = [];
  this._setSetting()._setInitialData();
}
Object.assign(OptionManager.prototype, {
  getOption: function (optionName) {
    if (optionName === 'tabs') {
      // returned result should be immutable
      let arr = [];
      for (let i = 0, tabs = this.options.tabs, l = tabs.length; i < l; i++) {
        arr.push({...tabs[i]});
      }
      return arr;
    }
    return this.options[optionName];
  },
  setOption: function (name = missingParamEr('setOption'), value = missingParamEr('setOption')) {
    if (['SELECTEDTABID', 'TABS'].indexOf(name.toUpperCase()) >= 0) return this;
    if (Object.prototype.hasOwnProperty.call(this._defaultOptions, name)) this.options[name] = value;
    return this;
  },
  validatePanelComponent: function (tabData) {
    // convert panel element into a  function component.
    if (
      tabData.panelComponent &&
      typeof tabData.panelComponent !== 'function' &&
      React.isValidElement(tabData.panelComponent)
    ) {
      const PanelElement = tabData.panelComponent;
      tabData.panelComponent = function () {
        return PanelElement;
      };
    }
    return this;
  },
  validateObjectiveTabData: function (tabData) {
    if (Object.prototype.toString.call(tabData) !== '[object Object]')
      throw new Error('tabData must be type of Object');
    return this;
  },
  validateTabData: function (tabData) {
    this.validateObjectiveTabData(tabData).validatePanelComponent(tabData);
    tabData = Object.assign(this.setting.getDefaultTabData(), tabData);
    tabData.id = tabData.id + ''; //make sure id is string
    return tabData;
  },
  _validateOptions: function (options) {
    if (Object.prototype.toString.call(options) !== '[object Object]')
      throw 'Invalid argument in "useDynamicTabs" function. Argument must be type of an object';
    return this;
  },
  _setInitialData: function () {
    // set this.initialTabs and this.initialState
    const {selectedTabID, tabs} = this.options,
      openTabIDs = [];
    tabs.forEach((tab) => {
      const newTab = this.validateTabData(tab);
      this.initialTabs.push(newTab);
      openTabIDs.push(newTab.id);
    });
    this.initialState = {
      selectedTabID: selectedTabID + '', //make sure it is type of string
      openTabIDs,
    };
    return this;
  },
  _setSetting: function () {
    this.setting = {
      tabClass: 'rc-dyn-tabs-tab',
      titleClass: 'rc-dyn-tabs-title',
      iconClass: 'rc-dyn-tabs-icon',
      selectedClass: 'rc-dyn-tabs-selected',
      hoverClass: 'rc-dyn-tabs-hover',
      tablistRootClass: 'rc-dyn-tabs-tablist-root',
      tablistSectionClass: 'rc-dyn-tabs-tablist-sec',
      tablistSliderClass: 'rc-dyn-tabs-tablist-slider',
      tablistClass: 'rc-dyn-tabs-tablist',
      closeClass: 'rc-dyn-tabs-close',
      panelClass: 'rc-dyn-tabs-panel',
      panellistClass: 'rc-dyn-tabs-panellist',
      disableClass: 'rc-dyn-tabs-disable',
      ltrClass: 'rc-dyn-tabs-ltr',
      rtlClass: 'rc-dyn-tabs-rtl',
      verticalClass: 'rc-dyn-tabs-vertical',
      hiddenClass: 'rc-dyn-tabs-hidden',
      MoreButtonComponent: function MoreButtonComponent() {
        return null;
      },
      panelIdTemplate: (id) => `rc-dyn-tabs-p-${id}`,
      ariaLabelledbyIdTemplate: (id) => `rc-dyn-tabs-l-${id}`,
      getRenderableTabs: (openTabIDs) => openTabIDs,
      getDefaultTabData: () => {
        return {
          title: '',
          tooltip: '',
          panelComponent: this.options.defaultPanelComponent,
          closable: true,
          iconClass: '',
          disable: false,
          lazy: false,
          id: `tab_${new Date().getTime()}`,
        };
      },
    };
    return this;
  },
});
export default OptionManager;
