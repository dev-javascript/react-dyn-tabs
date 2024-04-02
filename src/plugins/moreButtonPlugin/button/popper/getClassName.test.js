/* eslint-disable react/prop-types */
import getClassName from './getClassName.js';
describe('popper className:', () => {
  const getIns = (dir) => ({
    getOption: () => dir,
    optionsManager: {
      setting: {
        showMorePopperClass: 'rc-dyn-tabs-popper',
        tablistViewClass: 'rc-dyn-tabs-tablist-view',
        verticalClass: 'rc-dyn-tabs-vertical',
        rtlClass: 'rc-dyn-tabs-rtl',
      },
    },
  });
  test('ltr', () => {
    const className = getClassName(getIns('ltr'));
    expect(className).toBe('rc-dyn-tabs-tablist-view rc-dyn-tabs-vertical rc-dyn-tabs-popper');
  });
  test('rtl', () => {
    const className = getClassName(getIns('rtl'));
    expect(className).toBe('rc-dyn-tabs-tablist-view rc-dyn-tabs-vertical rc-dyn-tabs-rtl rc-dyn-tabs-popper');
  });
});
