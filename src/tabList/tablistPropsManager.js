export default function ({ api }) {
    const _setting = api.optionsManager.setting
        , _op = api.optionsManager.options
        , result = {
            className: _setting.tablistClass + ' ' + _setting[_op.direction + 'Class']
        };
    if (_op.accessibility) {
        result.role = 'tablist';
    }
    return result;
};