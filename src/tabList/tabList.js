import React, { memo } from 'react';
import { ApiContext, StateContext } from '../utils/context.js';
import './index.css';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';
const TabList = memo(function TabList(props) {
    const { openTabIDs, selectedTabID } = React.useContext(StateContext)
        , api = React.useContext(ApiContext)
        , tablistProps = tablistPropsManager({ api });
    return (
        <ul {...tablistProps}>
            {openTabIDs.map(id => <Tab key={id} id={id} selectedTabID={selectedTabID}></Tab>)}
        </ul>
    )
}, () => true);
export default TabList;