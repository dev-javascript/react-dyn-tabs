import React, { memo } from 'react';
//https://stackoverflow.com/questions/54254553/dynamic-import-in-react-not-working-when-trying-to-import-a-component-in-another
const WrapperPanelComponent = memo(function WrapperPanelComponent(props) {
    return props.childComponent;
}, () => true);
// to do... => writting this section with Sets instead of using Array
const PanelProxy = function (panelId) {
    this._renderedPanels = [];
    panelId && this._renderedPanels.push(panelId);
}
PanelProxy.prototype._isExisted = function (id) { return this._renderedPanels.indexOf(id) >= 0; };
PanelProxy.prototype.addRenderedPanel = function (panelId) {
    this._isExisted(panelId) || this._renderedPanels.push(panelId);
};
PanelProxy.prototype.removeRenderedPanel=function(panelId){
    this._renderedPanels.splice(this._renderedPanels.indexOf(panelId),1);
};
PanelProxy.prototype.removeAllDeactiveRenderedPanel=function(activePanelId){
    this._renderedPanels=[activePanelId];
};
PanelProxy.prototype.getPanel = function (panelId, panelComponent) {
    return this._isExisted(panelId) ?
        <WrapperPanelComponent childComponent={panelComponent}></WrapperPanelComponent>
        : null;
};
export default PanelProxy;