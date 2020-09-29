const getDefaultTabObj = function () {
    return {
        title: "unkow",
        tooltip: "",
        panelComponent: null,
        closable: true,
        iconClass: "",
        disable: false
    };
};
const getSetting = function () {
    return {
        defaultCssClasses: {
            tab: 'reactHookTab-default-tab',
            tabTitle: 'tabTitle',
            activeTab: 'reactHookTab-active-tab',
            hoverTab: 'reactHookTab-hover-tab',
            tabList: 'reactHookTab-default-tabList',
            closeIcon: 'reactHookTab-default-closeIcon',
            hoverCloseIcon: 'reactHookTab-hover-closeIcon',
            panel: 'reactHookTab-default-panel',
            activePanel: 'reactHookTab-active-panel',
            panelList: 'reactHookTab-default-panelList',
            disable: 'disable',
            ltr: 'ltr',
            rtl: 'rtl'
        },
        defaultEvents: {
            beforeSelect: function (id) { return true; },
            beforeClose: function (id) { return true; },
            onOpen: function (IDs) { },
            onClose: function (IDs) { },
            onSelect: function ({ currentSelectedTabId, perviousSelectedTabId }) { },
            onChange: function ({ currentData, perviousData }) { },
            onInit: function () { },
            onDestroy: function () { }
        },
        getDefaultTabObj,
        defaultDirection: 'ltr'
    };
};
export default getSetting;
