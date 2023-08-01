export default function ({api, dir, isVertical}) {
  const _setting = api.optionsManager.setting,
    _op = api.optionsManager.options,
    result = {
      className: _setting.tablistClass + ' ' + _setting[dir + 'Class'],
    };
  if (isVertical) {
    result.className += ' ' + _setting.verticalClass;
  }
  if (_op.accessibility) {
    result.tablistProps.role = 'tablist';
  }

  return result;
}
