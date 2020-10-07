import React from "react";
const TabTitle = function (props) {
    debugger;
    const { id, api, isSelected } = props
        , option = api.getOptions(), setting = api.getSetting();
    if (option.tabComponent) {
        const TabTitleCom = option.tabComponent;
        return <TabTitleCom api={api.userProxy} id={id} isSelected={isSelected} ></TabTitleCom>;
    }
    const tabObj = api.getTabObj(id)
        , { title, selected, icon } = setting.cssClasses
        , tabTitleCssClass = isSelected ? title + ' ' + selected : title;
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