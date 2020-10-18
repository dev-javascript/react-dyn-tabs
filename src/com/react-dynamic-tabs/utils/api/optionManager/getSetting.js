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
        getDefaultTabObj: () => ({
            title: "unnamed tab",
            tooltip: "",
            panelComponent: null,
            closable: true,
            iconClass: "",
            disable: false
        }),
        defaultDirection: 'ltr',
        directionsRange: ['ltr', 'rtl'],
        idTemplate: {
            panel: id => id,
            ariaLabelledby: id => `label_${id}`
        }
    };
};
export default getSetting;
