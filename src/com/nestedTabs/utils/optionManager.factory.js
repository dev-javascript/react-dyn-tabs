function OptionManager(getDeps, { options }) {
    const { setting, defaultOptionsIns, ArgumentsValidationIns } = getDeps();
    this._validation = ArgumentsValidationIns
    this._validation.isObj(options);
    this.options = {};
    this.setting = setting;
    this._getDefaultOptions = () => defaultOptionsIns.create();
    this.setNewOptions(options);
};
OptionManager.prototype.getCopyOptions = function () { return Object.assign(this._getDefaultOptions(), this.options); };
OptionManager.prototype.getMutableOptions = function () { return this.options; };
OptionManager.prototype.setNewOptions = function (newOptions) {
    this._validation.isObj(newOptions);
    this.options = Object.assign(this._getDefaultOptions(), newOptions);
    return this;

};
export default OptionManager;