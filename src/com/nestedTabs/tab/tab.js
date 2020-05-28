import React, { memo, useContext, useEffect, useRef, useLayoutEffect } from "react";
import "./index.css";
import { ApiContext } from "../utils/context.js";
import useCounter from '../utils/useCounter';
const Tab = memo(
    function Tab(props) {
        const [isFirstCall] = useCounter();
        const { id, activeTabId } = props, api = React.useContext(ApiContext), isActive = activeTabId === id;
        const { data: { allTabs }, classNames: { tab: defaultClass, activeTab: activeClass } } = api.getMutableCurrentOptions();

        useEffect(() => api.tabDidMount({ tabId: id, isActive }), [id]);
        useEffect(() => api.tabDidUpdate({ tabId: id, isActive, isFirstCall }), [activeTabId]);

        const mousedown = function (e) { api.activeTabEventHandler(e, id); };
        const click = function (e) { api.activeTabEventHandler(e, id); };
        const mouseup = function (e) { api.activeTabEventHandler(e, id); };

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
