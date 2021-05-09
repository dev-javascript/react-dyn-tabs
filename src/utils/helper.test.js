import helper from './helper.js';
describe("helper : ", () => {
    test('getArraysDiff method should work correctly', () => {
        const dif = helper.getArraysDiff;
        const arr0 = [], arr1 = [1], arr2 = ['1', '3'], arr3 = ['1', '2', '3', '4'], arr4 = ['0', '2', '3', '5'];
        const dif01 = dif(arr0, arr1), dif10 = dif(arr1, arr0), dif23 = dif(arr2, arr3), dif32 = dif(arr3, arr2), dif34 = dif(arr3, arr4);
        expect((dif01[0].join() + '_' + dif01[1].join()) === '_1').toBe(true);
        expect((dif10[0].join() + '_' + dif10[1].join()) === '1_').toBe(true);
        expect((dif23[0].join() + '_' + dif23[1].join()) === '_2,4').toBe(true);
        expect((dif32[0].join() + '_' + dif32[1].join()) === '2,4_').toBe(true);
        expect((dif34[0].join() + '_' + dif34[1].join()) === '1,4_0,5').toBe(true);
    });
    test('getCopyState method should work correctly', () => {
        const copy = helper.getCopyState;
        const state1 = { selectTabID: '1', openTabIDs: ['1,2'] }, state2 = { selectTabID: '1' };
        const copyState1 = copy(state1), copyState2 = copy(state2);
        expect(copyState1 != state1).toBe(true);
        expect(copyState1.openTabIDs != state1.openTabIDs).toBe(true);
        expect(copyState2 != state2).toBe(true);
        expect(copyState2.openTabIDs != state2.openTabIDs).toBe(true);
    });
});