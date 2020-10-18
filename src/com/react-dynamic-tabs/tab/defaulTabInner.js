import React from "react";
const DefaulTabInner = function (props) {
    const { id, api } = props, userIconClass = api.getTabObj(id).iconClass
        , { icon: defaultIconClass } = api.getSetting().cssClasses;
    return (
        <button {...props.liInnerProps}>
            {
                userIconClass &&
                <span className={`${userIconClass} ${defaultIconClass}`}></span>
            }
            {props.children}
        </button>
    );
};
export default DefaulTabInner;