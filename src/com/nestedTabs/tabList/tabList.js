import React, { memo, useContext, useEffect, useRef } from 'react';
import { ApiContext, StateContext } from '../utils/context.js';
import './index.css';
import Tab from '../tab/tab.js';
import useCounter from '../utils/useCounter';
const TabList = memo(function TabList(props) {
    const [isFirstCall] = useCounter();
    const { openTabsId, activeTabId } = useContext(StateContext);
    const api = useContext(ApiContext);
    const { classNames: { tabList: defaultClass } } = api.getMutableCurrentOptions();
    React.useLayoutEffect(() => {
        debugger;
    });
    useEffect(() => {
        api.tabListDidUpdateByActiveTabId(activeTabId, isFirstCall);
    }, [activeTabId]);
    return (
        <ul className={`nestedTab_tabList${defaultClass}`}>
            {openTabsId.map(id => <Tab key={id} id={id} activeTabId={activeTabId}></Tab>)}
        </ul>
    )
}, () => true);
export default TabList;