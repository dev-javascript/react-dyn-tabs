import TablistView from './tablistView.factory.js';
export const tablistViewPropsManager = function (ins) {
  let className = ins.getSetting('tablistViewClass') + ' ' + ins.getSetting(`${ins.getOption('direction')}Class`);
  if (ins.getOption('isVertical')) {
    className += ' ' + ins.getSetting('verticalClass');
  }
  return {className};
};
export default TablistView.bind(undefined, (ins) => ({
  tablistViewPropsManager: () => tablistViewPropsManager(ins),
}));
