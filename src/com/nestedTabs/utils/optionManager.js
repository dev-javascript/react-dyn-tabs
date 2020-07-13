function OptionManager({ options, setting, DefaultOption }) {
    this.currentOptions = {};
    this.setting = setting;
    this.getDefaultOptions = () => new (DefaultOption)(setting).getOption();
    options && this._validateOptions(options).setNewOptions(options);
    this.initialOptions = options || {};
};
OptionManager.prototype.reset = function () { this.currentOptions = this.getInitialOptionsCopy(); return this; };
OptionManager.prototype.getInitialOptionsCopy = function () { return Object.assign(this.getDefaultOptions(), this.initialOptions); };
OptionManager.prototype.getCurrentOptionsCopy = function () { return Object.assign(this.getDefaultOptions(), this.currentOptions); };
OptionManager.prototype.getMutableCurrentOptions = function () { return this.currentOptions; };
OptionManager.prototype.getData = function () {
    const { data: { activeTabId, openTabsId }, } = this.currentOptions;
    return { activeTabId, openTabsId };
};
OptionManager.prototype.setNewOptions = function (newOptions) {
    this._validateOptions(newOptions);
    this.currentOptions = Object.assign(this.getDefaultOptions(), newOptions);
    return this;

};
OptionManager.prototype._validateOptions = function (options) {
    if (!(options && (typeof options === 'object')))
        throw 'invalid passed option! option must be an object';
    return this;
};
export default OptionManager;