import Helper from '../helper.js';
export default Helper.module(
  function Tabs({initialTabs} = {initialTabs: []}) {
    this._data = [];
    if (initialTabs && initialTabs.constructor === Array && initialTabs.length) {
      initialTabs.forEach((tab) => {
        this._addTab(tab);
      });
    }
  },
  {
    _addTab: function (tabObj) {
      this._data.push(tabObj);
      return this;
    },
    _removeTab: function (id) {
      const delIndex = this._data.findIndex((tab) => tab.id === id);
      delIndex >= 0 && this._data.splice(delIndex, 1);
      return this;
    },
    getTab: function (id) {
      return this._data.find((tab) => tab.id === id);
    },
    _setTab: function (id, newData) {
      const _index = this._data.findIndex((tab) => tab.id == id);
      if (_index >= 0) {
        const oldData = this._data[_index];
        newData.id = oldData.id; // id can not be changed.
        Object.assign(this._data[_index], newData);
      }
      return this;
    },
  },
);
