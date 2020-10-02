import React, { lazy, Suspense } from 'react';
import User from './user.js';
const tabComponent = function (props) {
    const { api, tabId: id, isActive } = props
        , tabObj = api.getTabObj(id)
        , style = isActive ? { backgroundColor: 'gold' } : { backgroundColor: 'red' };
    style.padding = '4px 10px 4px 10px';
    return (
        <div className='' style={style}>
            {tabObj.title}
            <i className={tabObj.iconClass} style={{ 'display': 'inline-block' }}></i>
        </div>
    );
};
const data2 = {
    data: {
        allTabs: [{
            id: '1',
            title: 'city 1',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={1}></User></Suspense>
        }, {
            id: '2',
            title: 'country 2',
            iconClass: 'ui-icon ui-icon-seek-end',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={2}></User></Suspense>
        }],
        openTabsId: ['1', '2'],
        activeTabId: '1'
    },
    events: {
        onSwitchTab: (switchTabsId, api) => {
        }
    }
};
const data1 = {

    data: {
        allTabs: [{
            id: '1',
            title: 'user 1',
            closable: true,
            iconClass: 'ui-icon ui-icon-seek-end',
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={1}></User></Suspense>
        }, {
            id: '2',
            title: 'home 2',
            closable: false,
            iconClass: 'glyphicon glyphicon-asterisk',
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={2}></User></Suspense>
        }, {
            id: '3',
            title: 'about site 3',
            closable: true,
            disable: false,
            iconClass: 'fa fa-backward',
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={3}></User></Suspense>
        }],
        openTabsId: ['1', '2', '3'],
        activeTabId: '3'
    },
    tabComponent,
    cssClasses: {
        // tabTitle: 'ui-state-default'
    },
    events: {
        onOpen: function (IDs) { debugger; },
        onClose: function (IDs) { debugger; },
        onSelect: function (param) { debugger; },
        onSwitchTab: (switchTabsId, api) => {
        },
        onCloseTab: function (id, api) {
        }
    },
    direction: 'rtl'
};
export { data1, data2 };
// const api = {
//     reset: () => { },
//     setEvent: (eventName, callback) => { },
//     getData: (openTabsId, activeTabId) => { },
//     openTabById: tabId => { },
//     closeTabById: tabId => { }
// };