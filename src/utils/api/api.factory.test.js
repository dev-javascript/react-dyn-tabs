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
            _getFlushEffectsPromise: jest.fn(() => Promise),
            _open: jest.fn(() => { })
        });
        obj.open({ id: '2' });
        expect(obj._addTab.mock.calls.length === 1).toBe(true);
        expect(obj._addTab).toHaveBeenCalledBefore(obj._getFlushEffectsPromise);
        expect(obj._getFlushEffectsPromise).toHaveBeenCalledBefore(obj._open);
    });
});
describe('Api.prototype.close : ', () => {
    test('it throws an error if is called with undefined id parameter', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        expect.assertions(2);
        try {
            obj.close();
        } catch (er) {
            expect(1 === 1).toBe(true);
        }
        try {
            obj.close(undefined);
        } catch (er) {
            expect(1 === 1).toBe(true);
        }
    });
    test('it should call select function internally if switch parameter was true and tab was already opended and selected', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        expect.assertions(3);
        Object.assign(obj, {
            __close: jest.fn(() => { return Promise.resolve({ currentData: {}, instance: {} }) }),
            select: jest.fn(() => Promise),
            isOpen: jest.fn(() => true),
            stateRef: { openTabIDs: ['1', '2'], selectedTabID: '2' },
            _findTabIdForSwitching: jest.fn(() => '1'),
            isSelected: jest.fn(() => true)
        });
        return obj.close('2', true).then(result => {
            expect(result.hasOwnProperty('currentData') && result.hasOwnProperty('instance')).toBe(true);
            expect(obj.__close.mock.calls.length === 1).toBe(true);
            expect(obj.select).toHaveBeenCalledBefore(obj.__close);
        });
    });
    test('switch parameter default value is true', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        expect.assertions(3);
        Object.assign(obj, {
            __close: jest.fn(() => { return Promise.resolve({ currentData: {}, instance: {} }) }),
            select: jest.fn(() => Promise),
            isOpen: jest.fn(() => true),
            stateRef: { openTabIDs: ['1', '2'], selectedTabID: '2' },
            _findTabIdForSwitching: jest.fn(() => '1'),
            isSelected: jest.fn(() => true)
        });
        return obj.close('2').then(result => {
            expect(result.hasOwnProperty('currentData') && result.hasOwnProperty('instance')).toBe(true);
            expect(obj.__close.mock.calls.length === 1).toBe(true);
            expect(obj.select).toHaveBeenCalledBefore(obj.__close);
        });
    });
    test('it should not call select function internally if switch parameter was false', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        expect.assertions(3);
        Object.assign(obj, {
            __close: jest.fn(() => { return Promise.resolve({ currentData: {}, instance: {} }) }),
            select: jest.fn(() => Promise),
            isOpen: jest.fn(() => true),
            stateRef: { openTabIDs: ['1', '2'], selectedTabID: '2' },
            _findTabIdForSwitching: jest.fn(() => '1'),
            isSelected: jest.fn(() => true)
        });
        return obj.close('2', false).then(result => {
            expect(result.hasOwnProperty('currentData') && result.hasOwnProperty('instance')).toBe(true);
            expect(obj.__close.mock.calls.length === 1).toBe(true);
            expect(obj.select.mock.calls.length === 0).toBe(true);
        });
    });
    test('it should not call select function internally if tab was not opened', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        expect.assertions(3);
        Object.assign(obj, {
            __close: jest.fn(() => { return Promise.resolve({ currentData: {}, instance: {} }) }),
            select: jest.fn(() => Promise),
            isOpen: jest.fn(() => false),
            stateRef: { openTabIDs: ['1', '2'], selectedTabID: '2' },
            _findTabIdForSwitching: jest.fn(() => '1'),
            isSelected: jest.fn(() => true)
        });
        return obj.close('2', true).then(result => {
            expect(result.hasOwnProperty('currentData') && result.hasOwnProperty('instance')).toBe(true);
            expect(obj.__close.mock.calls.length === 1).toBe(true);
            expect(obj.select.mock.calls.length === 0).toBe(true);
        });
    });
    test('it should not call select function internally if tab was not selected', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        expect.assertions(3);
        Object.assign(obj, {
            __close: jest.fn(() => { return Promise.resolve({ currentData: {}, instance: {} }) }),
            select: jest.fn(() => Promise),
            isOpen: jest.fn(() => true),
            stateRef: { openTabIDs: ['1', '2'], selectedTabID: '2' },
            _findTabIdForSwitching: jest.fn(() => '1'),
            isSelected: jest.fn(() => false)
        });
        return obj.close('2', true).then(result => {
            expect(result.hasOwnProperty('currentData') && result.hasOwnProperty('instance')).toBe(true);
            expect(obj.__close.mock.calls.length === 1).toBe(true);
            expect(obj.select.mock.calls.length === 0).toBe(true);
        });
    });
    test('eventHandlerFactory method calls close function with switching=true if beforeClose callback returned true', () => {
        const obj = new (apiConstructor)(getDeps, { options: {} });
        const id = '1';
        const e = {
            target: {
                className: 'rc-dyn-tabs-close'
            }
        };
        const parentElement = {
            className: 'rc-dyn-tabs-tab',
            lastChild: e.target
        };
        e.target.parentElement = parentElement;
        Object.assign(obj, {
            close: jest.fn(() => Promise),
            beforeClose: jest.fn(() => true),
        });
        obj.eventHandlerFactory({ id, e });
        expect(obj.close.mock.calls.length === 1).toBe(true);
        expect(obj.close.mock.calls[0][0] === id).toBe(true);
        expect(obj.close.mock.calls[0][1] === true).toBe(true);
    });
});