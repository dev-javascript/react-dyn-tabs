/* eslint react/prop-types: 0 */
import React from 'react';
import Helper from '../../helper.js';
export default Helper.module(
  function (DefaulTabInnerComponent = null) {
    this.defaultDirection = 'ltr';
    this._DefaulTabInnerComponent = DefaulTabInnerComponent;
    this.directionsRange = ['ltr', 'rtl'];
  },
  {
    getOptions: function getOptions() {
      return this._getOptions();
    },
    _getOptions: function _getOptions() {
      const _options = {
        tabs: [],
        selectedTabID: '',
        theme: 'all-themes',
        tablistStyle: {},
        beforeSelect: function () {
          return true;
        },
        beforeClose: function () {
          return true;
        },
        onOpen: function () {},
        onClose: function () {},
        onFirstSelect: function () {},
        onSelect: function () {},
        onChange: function () {},
        onLoad: function () {},
        onDestroy: function () {},
        onInit: function () {},
        accessibility: true,
        isVertical: false,
        defaultPanelComponent: function defaultPanelComponent() {
          return <div></div>;
        },
      };
      let _direction = this.defaultDirection,
        _tabComponent = this._DefaulTabInnerComponent;
      const that = this;
      Object.defineProperties(_options, {
        direction: {
          get() {
            return _direction;
          },
          set(value) {
            if (that.directionsRange.indexOf(value) === -1)
              throw 'Invalid direction value! it can be eather of "ltr" or "rtl" ';
            _direction = value;
          },
          enumerable: true,
        },
        tabComponent: {
          get() {
            return _tabComponent;
          },
          set(fn) {
            if (fn && typeof fn !== 'function') throw 'tabComponent property must be type of a function.';
            _tabComponent = fn ? fn : that._DefaulTabInnerComponent;
          },
          enumerable: true,
        },
      });
      return _options;
    },
  },
);
