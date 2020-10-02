import React from "react";
const TabTitle = function (props) {
    const { tabId, api, isActive, setting } = props
        , option = api.getMutableOptions();
    if (option.tabComponent) {
        const TabTitleCom = option.tabComponent;
        return <TabTitleCom {...props}></TabTitleCom>;
    }
    const tabObj = api.getTabObj(tabId)
        , { title, selected, icon } = setting.cssClasses
        , tabTitleCssClass = isActive ? title + ' ' + selected : title;
    return (
        <span className={tabTitleCssClass}>
            {tabObj.title}
            {
                tabObj.iconClass &&
                <span className={icon + ' ' + tabObj.iconClass}></span>
            }

        </span>
    );
};
export default TabTitle;