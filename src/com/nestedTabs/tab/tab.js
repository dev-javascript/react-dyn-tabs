import React, { memo, useContext, useEffect, useLayoutEffect } from "react";
import "./index.css";
import { ApiContext, StateContext } from "../utils/context.js";
import { actions } from '../utils/stateManagement';
const Tab = memo(
    function Tab(props) {
        const { id } = props;
        useEffect(() => {
            let el = document.getElementById(`tab_${id}`);
            // if (el)
            //     alert(`open tab ${id} event ${el.innerHTML}`);
        }, [props.id]);
        const { activeTabId } = useContext(StateContext);
        useEffect(() => {
            console.log(`tab ${props.id} useEffect`);
            // if (activeTabId == id)
            //     if (document.getElementById(`tab_${id}`).className.includes('active'))
            //         alert(`active tab ${id} event`);
        });
        const api = useContext(ApiContext);
        const { data: { allTabs },
            classNames: { tab: { defaultClass, activeClass }, } } = api.getMutableCurrentOptions();
        const tabClk = function (e) {
            api.activeTab(id);
        };
        return (
            <li id={`tab_${id}`} className={`nestedTab_tab${defaultClass}${activeTabId == id ? ` 
             active${activeClass}` : ""}`} onMouseUp={tabClk}>
                {allTabs[id].title}
            </li>
        );
    },
    () => true
);
export default Tab;
