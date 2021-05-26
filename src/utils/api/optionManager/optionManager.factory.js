import React from 'react';
import Helper from '../../helper.js';
const { throwMissingParam: missingParamEr } = Helper;
function OptionManager(getDeps, { options }) {
    const { globalDefaultOptions } = getDeps();
    this._defaultOptions = globalDefaultOptions;
    this._validateOptions(options);
    this.options = Object.assign({}, this._defaultOptions, options);
    this.setting = {};
    this.initialState = {};
    this.initialTabs = [];
    this._setSetting()._setInitialData();
};
OptionManager.prototype.getOption = function (OptionName) {
    return this.options[OptionName];
};
OptionManager.prototype.setOption = function (name = missingParamEr('setOption'), value = missingParamEr('setOption')) {
    if (name.toUpperCase() === ('SELECTEDTABID' || 'OPENTABIDS' || 'DATA'))
        return this;
    if (this._defaultOptions.hasOwnProperty(name))
        this.options[name] = value;
    return this;
};
OptionManager.prototype.validatePanelComponent = function (tabData) {
    // convert panel element into a  function component.
    if (tabData.panelComponent && typeof tabData.panelComponent !== 'function' && React.isValidElement(tabData.panelComponent)) {
        const PanelElement = tabData.panelComponent;
        tabData.panelComponent = function (props) { return PanelElement; };
    }
    return this;
};
OptionManager.prototype.validateObjectiveTabData = function (tabData) {
    if (Object.prototype.toString.call(tabData) !== '[object Object]')
        throw new Error('tabData must be type of Object');
    return this;
};
OptionManager.prototype.validateTabData = function (tabData) {
    this.validateObjectiveTabData(tabData).validatePanelComponent(tabData);
    tabData = Object.assign(this.setting.getDefaultTabData(), tabData);
    tabData.id = tabData.id + '';//make sure id is string
    return tabData;
};
OptionManager.prototype._validateOptions = function (options) {
    if (Object.prototype.toString.call(options) !== '[object Object]')
        throw 'Invalid argument in "useDynamicTabs" function. Argument must be type of an object';
    return this;
};
OptionManager.prototype._setInitialData = function () {
    // set this.initialTabs and this.initialState
    const { selectedTabID, tabs } = this.options, openTabIDs = [];
    tabs.map(tab => {
        const newTab = this.validateTabData(tab);
        this.initialTabs.push(newTab);
        openTabIDs.push(newTab.id);
    });
    this.initialState = {
        selectedTabID: selectedTabID + '', //make sure it is type of string
        openTabIDs
    };
    return this;
};
OptionManager.prototype._setSetting = function () {
    this.setting = {
        tabClass: 'rc-dyn-tabs-tab',
        titleClass: 'rc-dyn-tabs-title',
        iconClass: 'rc-dyn-tabs-icon',
        selectedClass: 'rc-dyn-tabs-selected',
        hoverClass: 'rc-dyn-tabs-hover',
        tablistClass: 'rc-dyn-tabs-tablist',
        closeClass: 'rc-dyn-tabs-close',
        panelClass: 'rc-dyn-tabs-panel',
        panellistClass: 'rc-dyn-tabs-panellist',
        disableClass: 'rc-dyn-tabs-disable',
        ltrClass: 'rc-dyn-tabs-ltr',
        rtlClass: 'rc-dyn-tabs-rtl',
        panelIdTemplate: id => `rc-dyn-tabs-p-${id}`,
        ariaLabelledbyIdTemplate: id => `rc-dyn-tabs-l-${id}`,
        getDefaultTabData: () => {
            return {
                title: "",
                tooltip: "",
                panelComponent: this.options.defaultPanelComponent,
                closable: true,
                iconClass: "",
                disable: false,
                id: `tab_${(new (Date)()).getTime()}`
            };
        }
    };
    return this;
};
export default OptionManager;