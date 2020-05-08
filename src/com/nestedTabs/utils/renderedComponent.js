
import React, { memo } from 'react';
const WrapperPanelComponent = memo(function WrapperPanelComponent(props) {
    return props.childComponent;
}, () => true);
const EmptyDivComponent = memo(function WrapperPanelComponent(props) {
    return <div id={`panel_${props.id}`}></div>;
}, () => true);
// to do... => writting this section with Sets instead of using Array
const renderedComponent = function (params = {}) {
    let renderedComs = {}, isExisted = function (newTabId) { return renderedComs.hasOwnProperty(newTabId); };
    const { activeTab } = params;
    activeTab && (renderedComs[activeTab.id] = activeTab.panelComponent);
    this.addById = function (newTabId, panelElement) {
        isExisted(newTabId) ||
            (renderedComs[newTabId] = panelElement);
    };
    this.getById = function (newTabId) {
        return isExisted(newTabId) ?
            <WrapperPanelComponent childComponent={renderedComs[newTabId]}></WrapperPanelComponent>
            : <EmptyDivComponent id={newTabId}></EmptyDivComponent>;
    };
}
export default renderedComponent;