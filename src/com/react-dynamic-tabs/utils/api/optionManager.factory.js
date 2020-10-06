function OptionManager(getDeps, { options }) {
    const { setting, ArgumentsValidationIns } = getDeps();
    this._validation = ArgumentsValidationIns
    this._validation.isObj(options);
    this.options = {};
    this.setting = setting;
    this.setNewOptions(options);
};
OptionManager.prototype.getCopyOptions = function () { return Object.assign(this._getDefaultOptions(), this.options); };
OptionManager.prototype.getMutableOptions = function () { return this.options; };
OptionManager.prototype.setNewOptions = function (newOptions) {
    this._validation.isObj(newOptions);
    this.options = Object.assign(this._getDefaultOptions(), newOptions);
    return this;

};
OptionManager.prototype._getDefaultOptions = function () {
    const _options = {
        openTabIDs: [],
        selectedTabID: '',
        beforeSelect: function (e, id) { return true; },
        beforeClose: function (e, id) { return true; },
        onOpen: function (IDs) { },
        onClose: function (IDs) { },
        onSelect: function ({ currentSelectedTabId, perviousSelectedTabId }) { },
        onChange: function ({ currentData, perviousData }) { },
        onInit: function () { },
        onDestroy: function () { },
        tabComponent: ''
    };
    let _direction = this.setting.defaultDirection, _data = {};
    const that = this;
    Object.defineProperties(_options, {
        direction: {
            get() { return _direction; },
            set(value) {
                if (that.setting.directionsRange.indexOf(value) === -1)
                    throw 'Invalid direction value! it can be eather of "ltr" or "rtl" ';
                _direction = value;
            }
        },
        data: {
            get() { return _data; },
            set(arr) {
                arr.reduce((acc, item, i) => {
                    acc[item.id] = Object.assign(that.setting.getDefaultTabObj(), item);
                    return acc;
                }, _data);
            }
        }
    });
    return _options;
};
export default OptionManager;