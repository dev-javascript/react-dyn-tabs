function OptionManager(getDeps, { options }) {
    const { setting, globalDefaultOptions, DefaulTabInnerComponent } = getDeps();
    this.options = {};
    this._globalDefaultOptions = globalDefaultOptions;
    this._DefaulTabInnerComponent = DefaulTabInnerComponent;
    this.setting = setting;
    this.setNewOptions(options);
};
OptionManager.prototype.getMutableOptions = function () { return this.options; };
OptionManager.prototype.setNewOptions = function (newOptions) {
    this._validation(newOptions).options = Object.assign(this._getDefaultOptions(), this._globalDefaultOptions, newOptions);
    return this;
};
OptionManager.prototype._validation = function (options) {
    if (Object.prototype.toString.call(options) !== '[object Object]')
        throw 'Invalid argument in "useDynamicTabs" function. Argument must be type of an object';
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
        isCustomTabComponent: false,
        accessibility: true
    };
    let _direction = this.setting.defaultDirection, _data = {}, _tabComponent = this._DefaulTabInnerComponent;
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
                    acc[item.id] = Object.assign({}, that.setting.defaultTabObj, item);
                    return acc;
                }, _data);
            }
        },
        tabComponent: {
            get() { return _tabComponent },
            set(fn) {
                if (fn && (typeof fn !== 'function'))
                    throw 'tabComponent property must be type of a function.';
                _options.isCustomTabComponent = fn ? true : false;
                _tabComponent = fn ? fn : that._DefaulTabInnerComponent;
            }
        }
    });
    return _options;
};
export default OptionManager;