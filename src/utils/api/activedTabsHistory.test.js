import SelectedTabsHistory from './activedTabsHistory.js';
let obj = null;
beforeEach(() => {
  obj = new SelectedTabsHistory();
});
afterEach(() => {
  obj = null;
});
describe('SelectedTabsHistory.prototype.remove :  ', () => {
  test('it should remove all occurrences of an element in the array', () => {
    obj.tabsId = ['1', '2', '1', '3', '4', '2', '6'];
    obj.remove('1').remove('2');
    expect(obj.tabsId.indexOf('1')).toBe(-1);
    expect(obj.tabsId.indexOf('2')).toBe(-1);
  });
  test('it should not work with number as a parameter', () => {
    obj.tabsId = ['1', '2', '1', '3', '4', '2', '6'];
    obj.remove(1);
    expect(obj.tabsId.indexOf('1')).toBe(0);
  });
});
