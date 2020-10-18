const DefaultTabInnerProps = Object.create({
    get: function (param) {
        const { id, isSelected, api } = param
        Object.assign(param, { a11y: api.getOptions().accessibility }, { cssClasses: api.getSetting().cssClasses });
        return {
            id, isSelected, api,
            liInnerProps: this.getA11Y(this.getBase(param), param)
        };
    },
    getBase: function ({ cssClasses, api, id }) {
        return {
            id: api.helper.idTemplate.ariaLabelledby(id),
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