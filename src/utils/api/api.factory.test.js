import { apiProps, apiConstructor } from './api.factory';
import OptionManager from './optionManager/optionManager.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import Pub_Sub from './pub_sub.js';
import Tabs from './tabs.js';
import BaseApi from './baseApi.js';
import { TestScheduler } from 'jest';
let getDeps;
beforeAll(() => {
    apiConstructor.prototype = Object.create(BaseApi.prototype);
    helper.assingAll(apiConstructor.prototype, Tabs.prototype, Pub_Sub.prototype, apiProps).constructor = apiConstructor;
});
beforeEach(() => {
    getDeps = function (options = {}) {
        const activedTabsHistory = new (ActivedTabsHistory)(), optionsManager = new (OptionManager)({ options });
        BaseApi.call(this, helper);
        Tabs.call(this);
        Pub_Sub.call(this);
        return { activedTabsHistory, helper, optionsManager };
    };
});
afterEach(() => {
    getDeps = null;
});
describe('Api.prototype.getInitialState : ', () => {
    test('it should call _addTab internally per each tabData option', () => {
        const obj = new (apiConstructor)(getDeps, {
            options: {
                tabs: [
                    { id: '1', title: 'tab1' },
                    { id: '2', title: 'tab2' },
                    { id: '3', title: 'tab3' }
                ]
            }
        });
        obj._addTab = jest.fn(() => ({ id: '2' }));
        obj.getInitialState();
        expect(obj._addTab.mock.calls.length === 3).toBe(true);
    });
});
describe('Api.prototype.open : ', () => {
    test('it should call _addTab internally', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        Object.assign(obj, {
            _addTab: jest.fn(() => ({ id: '2' })),
            _getOnChangePromise: jest.fn(() => Promise),
            _open: jest.fn(() => { })
        });
        obj.open({ id: '2' });
        expect(obj._addTab.mock.calls.length === 1).toBe(true);
        expect(obj._addTab).toHaveBeenCalledBefore(obj._getOnChangePromise);
        expect(obj._getOnChangePromise).toHaveBeenCalledBefore(obj._open);
    });
});