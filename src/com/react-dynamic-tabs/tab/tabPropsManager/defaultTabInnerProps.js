const DefaultTabInnerProps = Object.create({
    get: function (param) {
        const { id, isSelected, api } = param, { cssClasses, keyTemps } = api.getSetting();
        Object.assign(param, { a11y: api.getOptions().accessibility, cssClasses, keyTemps });
        return {
            id, isSelected, api,
            liInnerProps: this.getA11Y(this.getBase(param), param)
        };
    },
    getBase: function ({ cssClasses, id, keyTemps }) {
        return {
            id: keyTemps.ariaLabelledby(id),
            className: cssClasses.title,
            tabIndex: -1
            //href: `#${api.helper.keyTemps.panel(id)}`
        };
    },
    getA11Y: function (obj, { a11y }) {
        a11y && (obj.role = 'presentation');
        return obj;
    },
});
export default DefaultTabInnerProps;