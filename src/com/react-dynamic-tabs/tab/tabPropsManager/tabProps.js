const TabProps = Object.create({
    get: function (param) {
        const { api } = param, { cssClasses, keyTemps } = api.getSetting();
        Object.assign(param, { cssClasses, keyTemps, op: api.getOptions(), tabObj: api.getTabObj(param.id) });
        return this._getA11Y(this._getDisabled(this._getSelected(this._getBase(param), param), param), param);
    },
    _getBase: function ({ id, cssClasses, api }) {
        return {
            'tab-id': id,
            className: cssClasses.tab,
            tabIndex: -1,
        };
    },
    _getDisabled: function (obj, { cssClasses, tabObj }) {
        if (tabObj.disable) {
            const { disable } = cssClasses;
            obj.tabIndex = -1;
            obj.className += ` ${disable}`;
        }
        return obj;
    },
    _getSelected: function (obj, { isSelected, cssClasses }) {
        if (isSelected) {
            const { selected } = cssClasses;
            obj.tabIndex = 0;
            obj.className += ` ${selected}`;
        };
        return obj;
    },
    _getA11Y: function (obj, { op, isSelected, id, keyTemps }) {
        if (op.accessibility && (!op.isCustomTabComponent)) {
            obj.role = 'tab';
            obj['aria-controls'] = keyTemps.panel(id);
            obj['aria-labelledby'] = keyTemps.ariaLabelledby(id);
            obj['aria-selected'] = isSelected;
            obj['aria-expanded'] = isSelected;
        };
        return obj;
    }
});
export default TabProps;