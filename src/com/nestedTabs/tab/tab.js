import React, { memo, useContext, useEffect, useRef, useLayoutEffect } from "react";
import "./index.css";
import { ApiContext } from "../utils/context.js";
const Tab = memo(
    function Tab(props) {
        const { id, activeTabId } = props, api = React.useContext(ApiContext), isActive = activeTabId === id;
        const { data: { allTabs }, classNames: { tab: defaultClass, activeTab: activeClass } } = api.getMutableCurrentOptions();

        const counter = useRef(0);
        counter.current++;

        useEffect(() => api.tabDidMount({ tabId: id, isActive }), [id]);
        useEffect(() => api.tabDidUpdate({ tabId: id, isActive, counter: counter.current }), [activeTabId]);

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
