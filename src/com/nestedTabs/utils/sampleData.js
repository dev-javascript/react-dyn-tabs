import React, { lazy, Suspense } from 'react';
import User from './user.js';
const data2 = {
    data: {
        allTabs: [{
            id: 1,
            title: 'city',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={1}></User></Suspense>
        }, {
            id: 2,
            title: 'country',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={2}></User></Suspense>
        }],
        openTabsId: [1, 2],
        activeTabId: 2
    },
    events: {
        afterSwitchTab: (tabId, panelId) => {
        }
    }
};
const data1 = {
    data: {
        allTabs: [{
            id: 1,
            title: 'user',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={1}></User></Suspense>
        }, {
            id: 2,
            title: 'home',
            closable: false,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={2}></User></Suspense>
        }, {
            id: 3,
            title: 'about site',
            closable: true,
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={3}></User></Suspense>
        }],
        openTabsId: [1, 2, 3],
        activeTabId: 1
    },
    events: {
        afterSwitchTab: (tabId, panelId) => {
        },
        afterCloseTab: function (param, param3) {
            const data = this.getData();
        }
    },
    switchTabEventMode: 'mousedown'
};
export { data1, data2 };
// const api = {
//     reset: () => { },
//     setEvent: (eventName, callback) => { },
//     getData: (openTabsId, activeTabId) => { },
//     openTabById: tabId => { },
//     closeTabById: tabId => { }
// };