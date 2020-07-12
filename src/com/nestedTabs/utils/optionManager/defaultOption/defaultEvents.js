export default {
    onmousedownTab: () => { return true; },
    onclickTab: () => { },
    onmouseupTab: () => { },
    onmousedownCloseIcon: () => { },
    onclickCloseIcon: () => { },
    onmouseupCloseIcon: () => { },

    beforeSwitchTab: function (e, tabId) { return true; },
    afterSwitchTab: function ({ tabId, panelId }) { },
    afterOpenTab: (tab) => { },
    beforeCloseTab: function (e, tabId) { return true; },
    afterCloseTab: (tab) => { },

    allTabsDidMount: () => { },
    allTabsDidUpdate: (param) => { },
    allTabsWillUnMount: () => { }
};