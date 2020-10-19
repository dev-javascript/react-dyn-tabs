export default {
    get: function (param) {
        const { api } = param, { cssClasses } = api.getSetting(), op = api.getOptions();
        param = Object.assign(param, { cssClasses, op });
        return this._getA11y(this._getBase(param), param);
    },
    _getBase: function ({ cssClasses }) {
        return { className: cssClasses.close };
    },
    _getA11y: function (obj, { op }) {
        if (op.accessibility && (!op.isCustomTabComponent))
            obj.role = 'presentation';
        return obj;
    }
};