import React from "react";
const TabTitle = function (props) {
    const { tabId, api, isActive } = props
        , option = api.getMutableOptions();
    if (option.tabComponent) {
        const TabTitleCom = option.tabComponent;
        return <TabTitleCom {...props}></TabTitleCom>;
    }
    const tabObj = api.getTabObj(tabId);
    return (
        <span role='presentation' className={option.cssClasses.tabTitle}>
            {tabObj.title}
            {tabObj.iconClass && <span className={tabObj.iconClass}></span>}
        </span>
    );
};
export default TabTitle;