const LiProps = Object.create({
    get: function (param) {
        const { api } = param;
        Object.assign(param, { cssClasses: api.getSetting().cssClasses }, { op: api.getOptions() }, { tabObj: api.getTabObj(param.id) });
        return this.getA11Y(this.getDisabled(this.getSelected(this.getBase(param), param), param), param);
    },
    getBase: function ({ id, cssClasses, api }) {
        return {
            id: api.helper.idTemplate.tab(id),
            className: cssClasses.tab,
            tabIndex: -1,
        };
    },
    getDisabled: function (obj, { cssClasses, tabObj }) {
        if (tabObj.disable) {
            const { disable } = cssClasses;
            obj.tabIndex = -1;
            obj.className += ` ${disable}`;
        }
        return obj;
    },
    getSelected: function (obj, { isSelected, cssClasses }) {
        if (isSelected) {
            const { selected } = cssClasses;
            obj.tabIndex = 0;
            obj.className += ` ${selected}`;
        };
        return obj;
    },
    getA11Y: function (obj, { op, api, isSelected, id }) {
        if (op.accessbility) {
            obj.role = 'tab';
            obj['aria-controls'] = api.helper.idTemplate.panel(id);
            obj['aria-labelledby'] = api.helper.idTemplate.ariaLabelledby(id);
            obj['aria-selected'] = isSelected;
            obj['aria-expanded'] = isSelected;
        };
        return obj;
    }
});
export default LiProps;