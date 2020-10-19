const DefaultTabInnerProps = Object.create({
    get: function (param) {
        const { id, isSelected, api } = param, { cssClasses, keyTemps } = api.getSetting();
        Object.assign(param, { a11y: api.getOptions().accessibility, cssClasses, keyTemps });
        return {
            id, isSelected, api,
            liInnerProps: this.getA11Y(this.getBase(param), param)
        };
    },
    getBase: function ({ cssClasses, id }) {
        return {
            'tab-id': id,
            className: cssClasses.title,
            tabIndex: -1
        };
    },
    getA11Y: function (obj, { a11y, keyTemps, id }) {
        if (a11y) {
            obj.id = keyTemps.ariaLabelledby(id);
            obj.role = 'presentation';
        }
        return obj;
    },
});
export default DefaultTabInnerProps;