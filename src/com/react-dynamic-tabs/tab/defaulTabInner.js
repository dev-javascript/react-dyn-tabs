import React from "react";
const DefaulTabInner = function (props) {
    return (
        <button {...props.txtWidgetProps}>
            {props.children}
            {
                props.iconProps &&
                <span {...props.iconProps}></span>
            }
        </button>
    );
};
export default DefaulTabInner;