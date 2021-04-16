import API from './api.js';
let obj = '';
beforeEach(() => {
    obj = new (API)();
});
describe('user api : ', () => {
    test('list all available props for consumer', () => {
        const userApiProps = `getTab,setTab,off,on,one,getOption,setOption,getCopyPerviousData,getCopyData,isSelected,isOpen,select,open,close,refresh`;
        expect(Object.keys(obj.userProxy).join() === userApiProps).toBe(true);
    });
});


