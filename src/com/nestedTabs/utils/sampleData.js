import React, { lazy, Suspense } from 'react';
import User from './user.js';
const data2 = {
    data: {
        allTabs: [{
            id: '1',
            title: 'city',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={1}></User></Suspense>
        }, {
            id: '2',
            title: 'country2',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={2}></User></Suspense>
        }],
        openTabsId: ['1', '2'],
        activeTabId: '1'
    },
    events: {
        afterSwitchTab: (tabId, panelId) => {
        }
    }
};
const data1 = {
    data: {
        allTabs: [{
            id: '1',
            title: 'user',
            closable: true,
            iconClass: 'ui-icon ui-icon-seek-end',
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={1}></User></Suspense>
        }, {
            id: '2',
            title: 'home',
            closable: false,
            iconClass: 'glyphicon glyphicon-asterisk',
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={2}></User></Suspense>
        }, {
            id: '3',
            title: 'about site',
            closable: true,
            disable: false,
            iconClass: 'fa fa-backward',
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={3}></User></Suspense>
        }],
        openTabsId: ['1', '2', '3'],
        activeTabId: '3'
    },
    cssClasses: {
        // tabTitle: 'ui-state-default'
    },
    events: {
        afterSwitchTab: (tabId, panelId) => {
        },
        afterCloseTab: function (param, param3) {
            const data = this.getData();
        }
    },
    switchTabEventMode: 'mousedown',
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