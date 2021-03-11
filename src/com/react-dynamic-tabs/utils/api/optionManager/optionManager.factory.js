import Helper from '../../helper.js';
const { throwMissingParam: missingParamEr } = Helper;
function OptionManager(getDeps, { options }) {
    const { globalDefaultOptions } = getDeps();
    this._defaultOptions = globalDefaultOptions;
    this._validateOptions(options);
    debugger;
    this.options = Object.assign({}, this._defaultOptions, options);
    this._setSetting();
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
OptionManager.prototype._validateOptions = function (options) {
    if (Object.prototype.toString.call(options) !== '[object Object]')
        throw 'Invalid argument in "useDynamicTabs" function. Argument must be type of an object';
    return this;
};
OptionManager.prototype._setSetting = function () {
    this.setting = {
        tabClass: 'rc-dyntabs-tab',
        titleClass: 'rc-dyntabs-title',
        iconClass: 'rc-dyntabs-icon',
        selectedClass: 'rc-dyntabs-selected',
        hoverClass: 'rc-dyntabs-hover',
        tablistClass: 'rc-dyntabs-tablist',
        closeClass: 'rc-dyntabs-close',
        panelClass: 'rc-dyntabs-panel',
        panellistClass: 'rc-dyntabs-panellist',
        disableClass: 'rc-dyntabs-disable',
        ltrClass: 'rc-dyntabs-ltr',
        rtlClass: 'rc-dyntabs-rtl',
        panelIdTemplate: id => `rc-dyn-tabs-p-${id}`,
        ariaLabelledbyIdTemplate: id => `rc-dyn-tabs-l-${id}`
    };
    return this;
};
export default OptionManager;