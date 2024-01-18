import TablistContainer from './tablistContainer.factory.js';
export const tablistContainerPropsManager = function (ins) {
  const className = ins.getSetting('tablistContainerClass');
  return {className};
};
export default TablistContainer.bind(undefined, (ins) => ({
  tablistContainerPropsManager: () => tablistContainerPropsManager(ins),
}));
