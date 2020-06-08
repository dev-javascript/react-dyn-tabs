import React, { memo, useEffect } from 'react';
import { ApiContext, StateContext } from '../utils/context.js';
import './index.css';
import Tab from '../tab/tab.js';
import { useCounter, useOldActiveId } from '../utils/helperHooks';
const TabList = memo(function TabList(props) {
    const [isFirstCall] = useCounter()
        , { openTabsId, activeTabId } = React.useContext(StateContext)
        , { oldActiveId, newActiveId, updateOldActiveId } = useOldActiveId(activeTabId)
        , api = React.useContext(ApiContext)
        , { classNames: { tabList: defaultClass } } = api.getMutableCurrentOptions();
    useEffect(() => {
        api.tabListDidUpdateByActiveTabId({ oldActiveId, newActiveId, isFirstCall });
        updateOldActiveId();
    }, [activeTabId]);
    return (
        <ul className={defaultClass}>
            {openTabsId.map(id => <Tab key={id} id={id} activeTabId={activeTabId}></Tab>)}
        </ul>
    )
}, () => true);
export default TabList;