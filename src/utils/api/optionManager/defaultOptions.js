import React from 'react';
const DefaultOptions = function (DefaulTabInnerComponent = null) {
    this.defaultDirection = 'ltr';
    this._DefaulTabInnerComponent = DefaulTabInnerComponent;
    this.directionsRange = ['ltr', 'rtl'];
};
DefaultOptions.prototype.getOptions = function () {
    return this._getOptions();
};
DefaultOptions.prototype._getOptions = function () {
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
        onInit: function () { },
        accessibility: true,
        defaultPanelComponent: function (props) { return <div></div>; }
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
                _tabComponent = fn ? fn : that._DefaulTabInnerComponent;
            },
            enumerable: true
        }
    });
    return _options;
};
export default DefaultOptions;