import React from "react";
const DefaulTabInner = function (props) {
    const { id, api } = props, userIconClass = api.getTabObj(id).iconClass
        , { icon: defaultIconClass } = api.getSetting().cssClasses;
    return (
        <button {...props.liInnerProps}>
            {props.children}
            {
                userIconClass &&
                <span className={`${userIconClass} ${defaultIconClass}`}></span>
            }
        </button>
    );
};
export default DefaulTabInner;