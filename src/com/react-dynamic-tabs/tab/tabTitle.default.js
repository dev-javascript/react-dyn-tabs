import React from "react";
const TabTitle = function (props) {
    return (
        <a {...props.aProps}>
            {
                props.iconProps &&
                <span {...props.iconProps}></span>
            }
            {props.children}
        </a>
    );
};
export default TabTitle;