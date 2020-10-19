export default Object.create({
    get: function (param) {
        const { api } = param, { cssClasses } = api.getSetting();
        Object.assign(param, { cssClasses, op: api.getOptions() });
        return this._getA11Y(this._getBase(param), param);
    },
    _getBase: function ({ cssClasses, op }) {
        return { className: cssClasses.tablist + ' ' + cssClasses[op.direction] };
    },
    _getA11Y: function (obj, { op }) {
        if (op.accessibility && (!op.isCustomTabComponent))
            obj.role = 'tablist';
        return obj;
    }
});