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
        <span>
            {tabObj.title}
            <span className={} style={{ 'display': 'inline-block' }}></span>
        </span>
    );
};
export default TabTitle;