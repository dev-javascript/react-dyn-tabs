export default function ({optionsManager: {setting: _setting, options: _op}}) {
  const {tablistRootClass, tablistSectionClass, tablistSliderClass, tablistClass} = _setting,
    result = {
      tablistRootProps: {className: tablistRootClass},
      tablistSectionProps: {className: tablistSectionClass},
      tablistSliderProps: {className: tablistSliderClass},
      tablistProps: {className: tablistClass},
    };
  if (_op.isVertical) {
    result.tablistRootProps.className += ' ' + _setting.verticalClass;
    result.tablistProps.className += ' ' + _setting.verticalClass;
  }
  if (_op.direction === 'rtl') {
    result.tablistRootProps.className += ' ' + _setting.rtlClass;
    result.tablistProps.className += ' ' + _setting.rtlClass;
  }
  if (_op.accessibility) {
    result.tablistProps.role = 'tablist';
  }

  return result;
}
