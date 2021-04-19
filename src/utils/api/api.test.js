import API from './api.js';
let obj = '';
beforeEach(() => {
    obj = new (API)();
});
describe('user api : ', () => {
    test('list all available props for consumer', () => {
        const userApi = ['getTab', 'setTab', 'off', 'on', 'one', 'getOption', 'setOption', 'getCopyPerviousData', 'getCopyData',
            'isSelected', 'isOpen', 'select', 'open', 'close', 'refresh'];
        expect(Object.keys(obj.userProxy).length === userApi.length).toBe(true);
        let _isEqual = true;
        userApi.map((value) => {
            if (!obj.userProxy.hasOwnProperty(value)) {
                _isEqual = false;
            }
        });
        expect(_isEqual).toBe(true);
    });
});


