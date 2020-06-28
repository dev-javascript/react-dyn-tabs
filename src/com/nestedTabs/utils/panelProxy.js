
import React, { memo } from 'react';
import { idTemplate } from './helper';
const WrapperPanelComponent = memo(function WrapperPanelComponent(props) {
    return props.childComponent;
}, () => true);
const EmptyDivComponent = memo(function WrapperPanelComponent(props) {
    return <div id={idTemplate.lazyPanel(props.id)}></div>;
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
PanelProxy.prototype.getPanel = function (panelId, panelComponent) {
    return this._isExisted(panelId) ?
        <WrapperPanelComponent childComponent={panelComponent}></WrapperPanelComponent>
        : <EmptyDivComponent id={panelId}></EmptyDivComponent>;
};
export default PanelProxy;