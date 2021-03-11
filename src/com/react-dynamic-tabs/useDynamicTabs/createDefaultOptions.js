const CreateDefaultOptions = function (fn, DefaulTabInnerComponent = null) {
    this.fn = fn;
    this.defaultDirection = 'ltr';
    this._DefaulTabInnerComponent = DefaulTabInnerComponent;
    this.directionsRange = ['ltr', 'rtl'];
    this._create(this._getOptions());
};
CreateDefaultOptions.prototype._create = function (options) {
    this.fn.options = options;
};
CreateDefaultOptions.prototype._getOptions = function () {
    const _options = {
        tabs: [],
        selectedTabID: '',
        beforeSelect: function (e, id) { return true; },
        beforeClose: function (e, id) { return true; },
        onOpen: function (IDs) { },
        onClose: function (IDs) { },
        onSelect: function ({ currentSelectedTabId, perviousSelectedTabId }) { },
        onChange: function ({ currentData, perviousData }) { },
        onLoad: function (api) { },
        onDestroy: function () { },
        isCustomTabComponent: false,// shoud be removed
        accessibility: true,
        defaultPanelComponent: null
    };
    let _direction = this.defaultDirection, _tabComponent = this._DefaulTabInnerComponent;
    const that = this;
    Object.defineProperties(_options, {
        direction: {
            get() { return _direction; },
            set(value) {
                if (that.directionsRange.indexOf(value) === -1)
                    throw 'Invalid direction value! it can be eather of "ltr" or "rtl" ';
                _direction = value;
            },
            enumerable: true
        },
        tabComponent: {
            get() {
                return _tabComponent
            },
            set(fn) {
                if (fn && (typeof fn !== 'function'))
                    throw 'tabComponent property must be type of a function.';
                _options.isCustomTabComponent = fn ? true : false;
                _tabComponent = fn ? fn : that._DefaulTabInnerComponent;
            },
            enumerable: true
        }
    });
    return _options;
};
export default CreateDefaultOptions;