export default Object.create({
    get: function (param) {
        const { api } = param, { cssClasses, keyTemps } = api.getSetting();
        Object.assign(param, { cssClasses, keyTemps, op: api.getOptions() });
        return this._getA11Y(this._getSelected(this._getBase(param), param), param);
    },
    _getBase: function ({ id, cssClasses }) {
        return {
            'tab-id': id,
            className: cssClasses.panel,
        };
    },
    _getSelected: function (obj, { isSelected, cssClasses }) {
        if (isSelected) {
            const { selected } = cssClasses;
            obj.className += ` ${selected}`;
        };
        return obj;
    },
    _getA11Y: function (obj, { op, isSelected, id, keyTemps }) {
        if (op.accessibility && (!op.isCustomTabComponent)) {
            obj.role = 'tabpanel';
            obj.id = keyTemps.panel(id);
            obj['aria-hidden'] = isSelected ? false : true;
            obj['aria-labelledby'] = keyTemps.ariaLabelledby(id);
        };
        return obj;
    }
});