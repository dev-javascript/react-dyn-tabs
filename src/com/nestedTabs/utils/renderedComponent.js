
import React, { memo } from 'react';
const WrapperPanelComponent = memo(function WrapperPanelComponent(props) {
    return props.childComponent;
}, () => true);
const EmptyDivComponent = memo(function WrapperPanelComponent(props) {
    return <div id={`panel_${props.id}`}></div>;
}, () => true);
// to do... => writting this section with Sets instead of using Array
const renderedComponent = function (params = {}) {
    this.renderedComs = {};
    const { activeTabId, panelComponent } = params;
    activeTabId && (this.renderedComs[activeTabId] = panelComponent);
}
renderedComponent.prototype.isExisted = function (newTabId) { return this.renderedComs.hasOwnProperty(newTabId); };
renderedComponent.prototype.addById = function (newTabId, panelElement) {
    this.isExisted(newTabId) ||
        (this.renderedComs[newTabId] = panelElement);
};
renderedComponent.prototype.getById = function (newTabId) {
    return this.isExisted(newTabId) ?
        <WrapperPanelComponent childComponent={this.renderedComs[newTabId]}></WrapperPanelComponent>
        : <EmptyDivComponent id={newTabId}></EmptyDivComponent>;
};
export default renderedComponent;