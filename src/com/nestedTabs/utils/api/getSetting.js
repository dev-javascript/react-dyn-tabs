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
        cssClasses: {
            tab: 'rc-dyntabs-tab',
            title: 'rc-dyntabs-title',
            icon: 'rc-dyntabs-icon',
            selected: 'rc-dyntabs-selected',
            hover: 'rc-dyntabs-hover',
            tablist: 'rc-dyntabs-tablist',
            close: 'rc-dyntabs-close',
            panel: 'rc-dyntabs-panel',
            panellist: 'rc-dyntabs-panellist',
            disable: 'rc-dyntabs-disable',
            ltr: 'rc-dyntabs-ltr',
            rtl: 'rc-dyntabs-rtl'
        },
        defaultEvents: {
            beforeSelect: function (e, id) { return true; },
            beforeClose: function (e, id) { return true; },
            onOpen: function (IDs) { },
            onClose: function (IDs) { },
            onSelect: function ({ currentSelectedTabId, perviousSelectedTabId }) { },
            onChange: function ({ currentData, perviousData }) { },
            onInit: function () { },
            onDestroy: function () { }
        },
        getDefaultTabObj,
        defaultDirection: 'ltr',
        directionsRange: ['ltr', 'rtl']
    };
};
export default getSetting;
