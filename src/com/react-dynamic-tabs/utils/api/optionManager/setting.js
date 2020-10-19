let _number = 1;
const Setting = function () {
    this._num = _number++;
};
Setting.prototype.get = function () {
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
        defaultTabObj: {
            title: "unnamed tab",
            tooltip: "",
            panelComponent: null,
            closable: true,
            iconClass: "",
            disable: false
        },
        defaultDirection: 'ltr',
        directionsRange: ['ltr', 'rtl'],
        keyTemps: {
            panel: id => `rc-dyntabs${this._num}-p-${id}`,
            ariaLabelledby: id => `rc-dyntabs${this._num}-l-${id}`
        }
    };
};
export default Setting;
