import React from 'react';
function Tabs() {
    this._data = [];
}
Tabs.prototype._checkPanelComponent = function (DefaultPanelComponent, PanelComponent) {
    let NewPanelCom = PanelComponent;
    if (!PanelComponent)
        NewPanelCom = DefaultPanelComponent;
    else
        if (typeof PanelComponent !== 'function' && React.isValidElement(PanelComponent))
            NewPanelCom = function (props) { return PanelComponent; };
    return NewPanelCom;
};
Tabs.prototype._prepareTabData = (function () {
    const _getDefaultTabData = function (DefaultPanelComponent) {
        return {
            title: "",
            tooltip: "",
            panelComponent: DefaultPanelComponent,
            closable: true,
            iconClass: "",
            disable: false,
            id: `tab_${(new (Date)()).getTime()}`
        };
    };
    return function (tabData, DefaultPanelComponent) {
        if (Object.prototype.toString.call(tabData) !== '[object Object]')
            throw new Error('tabData must be type of Object');
        tabData.panelComponent = this._checkPanelComponent(DefaultPanelComponent, tabData.panelComponent);
        const newTabData = Object.assign(_getDefaultTabData(DefaultPanelComponent), tabData);
        newTabData.id = newTabData.id + '';//make sure id is string
        return newTabData
    };
})();
Tabs.prototype._addTab = function (tabObj, { defaultPanelComponent }) {
    const newTabObj = this._prepareTabData(tabObj, defaultPanelComponent);
    this._data.push(newTabObj);
    return newTabObj;
};
Tabs.prototype._removeTab = function (id) {
    const delIndex = this._data.findIndex(tab => tab.id === id);
    delIndex >= 0 && this._data.splice(delIndex, 1);
    return this;
};
Tabs.prototype.getTab = function (id) {
    return this._data.find(tab => tab.id === id);
};
Tabs.prototype._setTab = function (id, newData = {}, DefaultPanelComponent) {
    const _index = this._data.findIndex(tab => tab.id === id);
    if (_index >= 0) {
        newData.panelComponent = this._checkPanelComponent(DefaultPanelComponent, newData.panelComponent);
        const oldData = this._data[_index];
        newData.id = oldData.id; // can not change id
        Object.assign(this._data[_index], newData);
    }
    return this;
};
export default Tabs;