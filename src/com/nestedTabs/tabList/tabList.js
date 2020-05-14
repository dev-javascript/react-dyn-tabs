import React, { memo, useContext, useEffect } from 'react';
import { ApiContext, StateContext } from '../utils/context.js';
import './index.css';
import Tab from '../tab/tab.js';
const TabList = memo(function TabList(props) {
    const { openTabsId } = useContext(StateContext);
    const api = useContext(ApiContext);
    const { classNames: { tabList: defaultClass } } = api.getMutableCurrentOptions();
    useEffect(() => {
        console.log('tabList useEffect');
    });
    return (
        <ul className={`nestedTab_tabList${defaultClass}`}>
            {openTabsId.map(id => <Tab key={id} id={id}></Tab>)}
        </ul>
    )
}, () => true);
export default TabList;