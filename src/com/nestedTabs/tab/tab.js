import React, { memo, useContext, useEffect, useLayoutEffect } from "react";
import "./index.css";
import { ApiContext } from "../utils/context.js";
const Tab = memo(
    function Tab(props) {
        const { id, activeTabId } = props;
        useEffect(() => {
            console.log(`open tab with id : tab_${id}`);
        }, [props.id]);

        const api = React.useContext(ApiContext);
        const { data: { allTabs }, classNames: { tab: defaultClass, activeTab: activeClass } } = api.getMutableCurrentOptions();

        useEffect(() => {
            if (activeTabId == id) {
                const stackEvents = api.stackedEvent.afterActiveTab;
                while (stackEvents.length) {
                    const resolve = stackEvents.pop();
                    resolve(`tab_${id}`);
                }
            }
        });

        const mousedown = function (e) { api.activeTabEventHandler({ e, tabId: id }); };
        const click = function (e) { api.activeTabEventHandler({ e, tabId: id }); };
        const mouseup = function (e) { api.activeTabEventHandler({ e, tabId: id }); };

        return (
            <li id={`tab_${id}`} className={`nestedTab_tab${defaultClass}${activeTabId == id ? ` 
             active${activeClass}` : ""}`} onMouseUp={mouseup} onMouseDown={mousedown} onClick={click}>
                {allTabs[id].title}
            </li>
        );
    },
    (oldProps, newProps) => {
        const { id: tabId, activeTabId: oldActiveId } = oldProps, { activeTabId: newActiveId } = newProps;
        return oldActiveId === newActiveId || (tabId !== oldActiveId && (tabId !== newActiveId));
    }
);
export default Tab;
