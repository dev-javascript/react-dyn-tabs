import React, { memo, useContext, useEffect, useRef } from 'react';
import { ApiContext, StateContext } from '../utils/context.js';
import './index.css';
import Tab from '../tab/tab.js';
const TabList = memo(function TabList(props) {
    const counterObj = useRef(0);
    counterObj.current++;
    const { openTabsId, activeTabId } = useContext(StateContext);
    const api = useContext(ApiContext);
    const { classNames: { tabList: defaultClass } } = api.getMutableCurrentOptions();
    React.useLayoutEffect(() => {
        debugger;
    });
    useEffect(() => {
        api.tabListDidUpdateByActiveTabId(activeTabId, counterObj.current);
    }, [activeTabId]);
    return (
        <ul className={`nestedTab_tabList${defaultClass}`}>
            {openTabsId.map(id => <Tab key={id} id={id} activeTabId={activeTabId}></Tab>)}
        </ul>
    )
}, () => true);
export default TabList;