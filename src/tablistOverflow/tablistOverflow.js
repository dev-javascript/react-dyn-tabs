import Factory from './tablistOverflow.factory.js';
export const tablistOverflowPropsManager = function (ins) {
  return {
    style: {overflow: 'visible'},
    className: ins.getSetting('tablistOverflowClass'),
  };
};
export default Factory.bind(undefined, (ins) => ({
  tablistOverflowPropsManager: () => tablistOverflowPropsManager(ins),
}));
