import React from 'react';
import MemoPanel from '../../panel/memoPanel.js';
function Tabs() {
    this._data = [];
}
Tabs.prototype._getDefaultTabData = function () {
    return {
        title: "unnamed tab",
        tooltip: "",
        panelComponent: null,
        closable: true,
        iconClass: "",
        disable: false,
        id: `tab_${(new (Date)()).getTime()}`
    };
};
Tabs.prototype._addTab = function (tabObj) {
    tabObj = Object.assign(this._getDefaultTabData(), tabObj);
    this._data.push(tabObj);
    return this;
};
Tabs.prototype._removeTab = function (id) {
    const delIndex = this._data.findIndex(tab => tab.id === id);
    delIndex >= 0 && this._data.splice(delIndex, 1);
    return this;
};
Tabs.prototype.getTab = function (id) {
    return this._data.find(tab => tab.id === id);
};
Tabs.prototype.setTab = function (id, newData = {}, memoizePanel = true) {
    const _index = this._data.findIndex(tab => tab.id === id);
    if (_index >= 0) {
        const oldData = this._data[_index];
        newData.id = oldData.id; // can not change id
        if (memoizePanel && newData.panelComponent !== oldData.panelComponent && React.isValidElement(newData.panelComponent)) {
            newData.panelComponent = <MemoPanel>newData.panelComponent</MemoPanel>;
        }
        Object.assign(this._data[_index], newData);
    }
    return newData;
};
export default Tabs;