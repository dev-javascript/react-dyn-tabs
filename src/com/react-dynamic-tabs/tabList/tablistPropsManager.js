export default function ({ api }) {
    const _setting = api.optionsManager.setting
        , _op = api.optionsManager.options
        , result = {
            className: _setting.tablistClass + ' ' + _setting[_op.direction + 'class']
        };
    if (_op.accessibility) {
        result.role = 'tablist';
    }
    return result;
};
// Object.create({
//     get: function ({ api }) {
//         this._setting = api.optionsManager. ;
//         this._op = api.optionsManager.options;
//         return this._getA11Y(this._getBase());
//     },
//     _getBase: function () {
//         return {
//             className: this._setting.tablistClass + ' ' +
//                 this._setting[this._op.direction + 'class']
//         };
//     },
//     _getA11Y: function (obj) {
//         if (this._op.accessibility)
//             obj.role = 'tablist';
//         return obj;
//     }
// });