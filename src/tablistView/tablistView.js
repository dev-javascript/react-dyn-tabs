import TablistView from './tablistView.factory.js';
export const tablistViewPropsManager = function (ins) {
  let className = ins.getSetting('tablistViewClass') + ' ' + ins.getSetting(`${ins.getOption('direction')}Class`);
  if (ins.getOption('isVertical')) {
    className += ' ' + ins.getSetting('verticalClass');
  }
  const themeName = ins.getOption('theme');
  if (themeName) {
    className += ' ' + themeName;
  }
  const tablistStyle = ins.getOption('tablistStyle') || {};
  const result = {className};
  if (typeof tablistStyle === 'object') {
    result.style = tablistStyle;
  }
  return result;
};
export default TablistView.bind(undefined, (ins) => ({
  tablistViewPropsManager: () => tablistViewPropsManager(ins),
}));
