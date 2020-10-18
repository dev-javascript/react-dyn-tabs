const DefaultTabInnerProps = Object.create({
    get: function (param) {
        const { id, isSelected, api } = param, { cssClasses, idTemplate } = api.getSetting();
        Object.assign(param, { a11y: api.getOptions().accessibility, cssClasses, idTemplate });
        return {
            id, isSelected, api,
            liInnerProps: this.getA11Y(this.getBase(param), param)
        };
    },
    getBase: function ({ cssClasses, id, idTemplate }) {
        return {
            id: idTemplate.ariaLabelledby(id),
            className: cssClasses.title,
            tabIndex: -1
            //href: `#${api.helper.idTemplate.panel(id)}`
        };
    },
    getA11Y: function (obj, { a11y }) {
        a11y && (obj.role = 'presentation');
        return obj;
    },
});
export default DefaultTabInnerProps;