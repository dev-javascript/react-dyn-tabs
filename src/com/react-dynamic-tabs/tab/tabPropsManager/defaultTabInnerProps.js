const DefaultTabInnerProps = Object.create({
    get: function (param) {
        const { id, isSelected, api } = param, { cssClasses, keyTemps } = api.getSetting(),
            userIconClass = api.getTab(id).iconClass;
        Object.assign(param, { a11y: api.getOptions().accessibility, cssClasses, keyTemps, userIconClass });
        return {
            id, isSelected, api,
            txtWidgetProps: this._getA11Y(this._getBase(param), param),
            iconProps: userIconClass ? this._getA11Y_icon(this._getBase_icon(param), param) : ''
        };
    },
    _getBase: function ({ cssClasses, id }) {
        return {
            'tab-id': id,
            className: cssClasses.title,
            tabIndex: -1
        };
    },
    _getA11Y: function (obj, { a11y, keyTemps, id }) {
        if (a11y) {
            obj.id = keyTemps.ariaLabelledby(id);
            obj.role = 'presentation';
        }
        return obj;
    },
    _getBase_icon: function ({ cssClasses, userIconClass }) {
        return { className: userIconClass + ' ' + cssClasses.defaultIconClass };
    },
    _getA11Y_icon: function (obj, { a11y }) {
        a11y && (obj.role = 'presentation');
        return obj;
    }
});
export default DefaultTabInnerProps;