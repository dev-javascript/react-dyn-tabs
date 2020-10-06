import React, { memo } from 'react';
import { ApiContext, StateContext } from '../utils/context.js';
import './index.css';
import Tab from '../tab/tab.js';
const TabList = memo(function TabList(props) {
    const { openTabIDs, selectedTabID } = React.useContext(StateContext)
        , api = React.useContext(ApiContext)
        , { cssClasses, cssClasses: { tablist }, } = api.getSetting()
        , className = tablist + ' ' + cssClasses[api.getOptions().direction];
    return (
        <ul className={className} role='tablist'>
            {openTabIDs.map(id => <Tab key={id} id={id} selectedTabID={selectedTabID}></Tab>)}
        </ul>
    )
}, () => true);
export default TabList;