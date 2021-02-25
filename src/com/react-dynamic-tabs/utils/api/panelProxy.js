import React, { memo } from 'react';
const WrapperPanelComponent = memo(function WrapperPanelComponent(props) {
    if (!React.isValidElement(props.childComponent))
        throw `panelComponent propperty with tabID ${props.panelId} is not a valid react element`;
    return props.childComponent;
}, () => true);
const PanelProxy = function (panelId) {
    this._renderedPanels = [];
    panelId && this._renderedPanels.push(panelId);
}
PanelProxy.prototype._isExisted = function (id) { return this._renderedPanels.indexOf(id) >= 0; };
PanelProxy.prototype.addRenderedPanel = function (panelId) {
    (panelId || panelId == 0) && (this._isExisted(panelId) || this._renderedPanels.push(panelId));
};
PanelProxy.prototype.removeRenderedPanel = function (panelId) {
    (panelId || panelId == 0) && this._renderedPanels.splice(this._renderedPanels.indexOf(panelId), 1);
};
PanelProxy.prototype.setRenderedPanels = function (panelsIdArray) {
    this._renderedPanels = [...panelsIdArray];
};
PanelProxy.prototype.getPanel = function (panelId, panelComponent) {
    return this._isExisted(panelId) ?
        <WrapperPanelComponent childComponent={panelComponent} panelId={panelId}></WrapperPanelComponent>
        : null;
};
export default PanelProxy;