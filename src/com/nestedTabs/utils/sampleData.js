import React, { lazy, Suspense } from 'react';
import User from './user.js';
export const setting = {
    nestedTabsId: 1,
    data: {
        allTabs: [{
            id: 1,
            title: 'user',
            groupId: '',
            groupTitle: '',
            tooltip: '',
            tabElement: null,
            closeElement: null,
            panelFallbackElement: null,
            closable: true,
            extraData: {},
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={1}></User></Suspense>
        }, {
            id: 2,
            title: 'home',
            groupId: '',
            groupTitle: '',
            tooltip: '',
            tabElement: null,
            closeElement: null,
            panelFallbackElement: null,
            closable: true,
            extraData: {},
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={2}></User></Suspense>
        }, {
            id: 3,
            title: 'about site',
            groupId: '',
            groupTitle: '',
            tooltip: '',
            tabElement: null,
            closeElement: null,
            panelFallbackElement: null,
            closable: true,
            extraData: {},
            panelComponent: <Suspense fallback={<div>Loading...</div>}><User userId={3}></User></Suspense>
        }],
        openTabsId: [1, 2, 3],
        activeTabId: 1
    },
    classNames: {
        tab: {
            activeClass: '',
            defaultClass: '',
            hoverClass: '',
            hoverActiveTabClass: '',
            closeIconClass: '',
            hoverCloseIconClass: ''
        },
        tabList: {
            fullClass: '',
            emptyClass: '',
            defaultClass: ''
        },
        panel: {
            activeClass: '',
            defaultClass: '',
            loadingClass: ''
        },
        panelList: {
            emptyClass: '',
            defaultClass: ''
        }
    },
    events: {
        tabPanel: {
            beforeFirstRender: null,
            afterFirstRender: null,
            beforeDestroy: null,
            afterDestroy: null
        },
        tab: {
            click: null,
            beforeActive: null,
            afterActive: null,
            beforeDeActive: null,
            afterDeActive: null,
            beforeOpen: null,
            afterOpen: null,
            beforeClose: null,
            afterClose: null
        },
        panel: {
            beforeLoading: null,
            afterLoading: null,
            beforeOpen: null,
            afterOpen: null,
            beforeClose: null,
            afterClose: null,
            beforeActive: null,
            afterActive: null,
            beforeDeActive: null,
            afterDeActive: null,
            beforeFirstRender: null,
            afterFirstRender: null
        }
    },
    maxOpenTabsNumber: 4,
    defaultFallbackComponent: null
};
const api = {
    reset: () => { },
    setEvent: (eventName, callback) => { },
    getData: (openTabsId, activeTabId) => { },
    openTabById: tabId => { },
    closeTabById: tabId => { }
};