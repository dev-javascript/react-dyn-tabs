import {apiProps, apiConstructor} from './api.factory';
import OptionManager from './optionManager/optionManager.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import Pub_Sub from './pub_sub.js';
import Tabs from './tabs.js';
import BaseApi from './baseApi.js';
let getDeps, obj;
beforeAll(() => {
  apiConstructor.prototype = Object.create(BaseApi.prototype);
  helper.assingAll(apiConstructor.prototype, Tabs.prototype, Pub_Sub.prototype, apiProps).constructor = apiConstructor;
});
beforeEach(() => {
  getDeps = function (options = {}) {
    const activedTabsHistory = new ActivedTabsHistory(),
      optionsManager = new OptionManager({options});
    BaseApi.call(this, {
      helper,
      initialState: optionsManager.initialState,
    });
    Tabs.call(this, {initialTabs: optionsManager.initialTabs});
    Pub_Sub.call(this);
    return {activedTabsHistory, helper, optionsManager};
  };
  obj = new apiConstructor(getDeps, {
    options: {
      tabs: [
        {
          id: 'tab1',
          title: 'tabTitle1',
        },
        {
          id: 'tab2',
          title: 'tabTitle2',
        },
      ],
      selectedTabID: 'tab1',
    },
  });
});
afterEach(() => {
  getDeps = null;
  obj = null;
});
describe('Api.prototype.open : ', () => {
  test('it should call optionsManager.validateTabData internally', () => {
    Object.assign(obj, {
      _getFlushEffectsPromise: jest.fn(() => Promise),
      _open: jest.fn(() => {}),
    });
    obj.optionsManager.validateTabData = jest.fn((data) => data);
    obj.open({id: '2'});
    expect(obj.optionsManager.validateTabData.mock.calls.length === 1).toBe(true);
    expect(obj.optionsManager.validateTabData).toHaveBeenCalledBefore(obj._getFlushEffectsPromise);
    expect(obj._getFlushEffectsPromise).toHaveBeenCalledBefore(obj._open);
  });
  test('it throws an error if is called with falsy value of id parameter', () => {
    expect.assertions(3);
    try {
      obj.open();
    } catch (er) {
      expect(1 === 1).toBe(true);
    }
    try {
      obj.open(undefined);
    } catch (er) {
      expect(1 === 1).toBe(true);
    }
    try {
      obj.open(null);
    } catch (er) {
      expect(1 === 1).toBe(true);
    }
  });
});
describe('Api.prototype.close : ', () => {
  test('it throws an error if is called with undefined id parameter', () => {
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
    expect.assertions(3);
    Object.assign(obj, {
      __close: jest.fn(() => {
        return Promise.resolve({currentData: {}, instance: {}});
      }),
      select: jest.fn(() => Promise),
      isOpen: jest.fn(() => true),
      stateRef: {openTabIDs: ['1', '2'], selectedTabID: '2'},
      _findTabIdForSwitching: jest.fn(() => '1'),
      isSelected: jest.fn(() => true),
    });
    return obj.close('2', true).then((result) => {
      expect(
        Object.prototype.hasOwnProperty.call(result, 'currentData') &&
          Object.prototype.hasOwnProperty.call(result, 'instance'),
      ).toBe(true);
      expect(obj.__close.mock.calls.length === 1).toBe(true);
      expect(obj.select).toHaveBeenCalledBefore(obj.__close);
    });
  });
  test('switch parameter default value is true', () => {
    expect.assertions(3);
    Object.assign(obj, {
      __close: jest.fn(() => {
        return Promise.resolve({currentData: {}, instance: {}});
      }),
      select: jest.fn(() => Promise),
      isOpen: jest.fn(() => true),
      stateRef: {openTabIDs: ['1', '2'], selectedTabID: '2'},
      _findTabIdForSwitching: jest.fn(() => '1'),
      isSelected: jest.fn(() => true),
    });
    return obj.close('2').then((result) => {
      expect(
        Object.prototype.hasOwnProperty.call(result, 'currentData') &&
          Object.prototype.hasOwnProperty.call(result, 'instance'),
      ).toBe(true);
      expect(obj.__close.mock.calls.length === 1).toBe(true);
      expect(obj.select).toHaveBeenCalledBefore(obj.__close);
    });
  });
  test('it should not call select function internally if switch parameter was false', () => {
    expect.assertions(3);
    Object.assign(obj, {
      __close: jest.fn(() => {
        return Promise.resolve({currentData: {}, instance: {}});
      }),
      select: jest.fn(() => Promise),
      isOpen: jest.fn(() => true),
      stateRef: {openTabIDs: ['1', '2'], selectedTabID: '2'},
      _findTabIdForSwitching: jest.fn(() => '1'),
      isSelected: jest.fn(() => true),
    });
    return obj.close('2', false).then((result) => {
      expect(
        Object.prototype.hasOwnProperty.call(result, 'currentData') &&
          Object.prototype.hasOwnProperty.call(result, 'instance'),
      ).toBe(true);
      expect(obj.__close.mock.calls.length === 1).toBe(true);
      expect(obj.select.mock.calls.length === 0).toBe(true);
    });
  });
  test('it should not call select function internally if tab was not opened', () => {
    expect.assertions(3);
    Object.assign(obj, {
      __close: jest.fn(() => {
        return Promise.resolve({currentData: {}, instance: {}});
      }),
      select: jest.fn(() => Promise),
      isOpen: jest.fn(() => false),
      stateRef: {openTabIDs: ['1', '2'], selectedTabID: '2'},
      _findTabIdForSwitching: jest.fn(() => '1'),
      isSelected: jest.fn(() => true),
    });
    return obj.close('2', true).then((result) => {
      expect(
        Object.prototype.hasOwnProperty.call(result, 'currentData') &&
          Object.prototype.hasOwnProperty.call(result, 'instance'),
      ).toBe(true);
      expect(obj.__close.mock.calls.length === 1).toBe(true);
      expect(obj.select.mock.calls.length === 0).toBe(true);
    });
  });
  test('it should not call select function internally if tab was not selected', () => {
    expect.assertions(3);
    Object.assign(obj, {
      __close: jest.fn(() => {
        return Promise.resolve({currentData: {}, instance: {}});
      }),
      select: jest.fn(() => Promise),
      isOpen: jest.fn(() => true),
      stateRef: {openTabIDs: ['1', '2'], selectedTabID: '2'},
      _findTabIdForSwitching: jest.fn(() => '1'),
      isSelected: jest.fn(() => false),
    });
    return obj.close('2', true).then((result) => {
      expect(
        Object.prototype.hasOwnProperty.call(result, 'currentData') &&
          Object.prototype.hasOwnProperty.call(result, 'instance'),
      ).toBe(true);
      expect(obj.__close.mock.calls.length === 1).toBe(true);
      expect(obj.select.mock.calls.length === 0).toBe(true);
    });
  });
});
describe('Api.prototype.ready : ', () => {
  test('ready function must be a binded function', () => {
    expect(Object.prototype.hasOwnProperty.call(obj.ready, 'prototype') === false).toBe(true);
  });
  test('ready function should contain all userProxy properties :', () => {
    const readyProps = Object.keys(obj.ready).join();
    const uesrProxyProps = Object.keys(obj.userProxy).join();
    expect(uesrProxyProps === readyProps).toBe(true);
  });
  test('its type should be a function', () => {
    expect(typeof obj.ready === 'function').toBe(true);
  });
  test('ready function takes a function as a parameter and calls it immediately if _onReady is triggered', () => {
    obj.trigger('_onReady', obj.userProxy);
    const fn = jest.fn(function () {});
    obj.ready(fn);
    expect(fn.mock.calls.length === 1).toBe(true);
  });
  test('ready function calls its own function parameter with userProxy object as a parameter', () => {
    obj.trigger('_onReady', obj.userProxy);
    const fn = jest.fn(() => {});
    obj.ready(fn);
    expect(fn.mock.calls[0][0] === obj.userProxy).toBe(true);
  });
  test('ready function calls its own function parameter with userProxy object as a context', () => {
    expect.assertions(1);
    obj.trigger('_onReady', obj.userProxy);
    const fn = jest.fn(function () {
      expect(this === obj.userProxy).toBe(true);
    });
    obj.ready(fn);
  });
  test('ready function will call "one" method if _onReady event has not been triggerd', () => {
    obj.one = jest.fn(() => {});
    obj.ready(() => {});
    expect(obj.one.mock.calls.length === 1).toBe(true);
  });
  test(`ready function will call its function parameter whenever _onReady event is triggered`, () => {
    const fn = jest.fn(function () {});
    obj.ready(fn);
    expect(fn.mock.calls.length === 0).toBe(true);
    obj.trigger('_onReady', obj.userProxy);
    expect(fn.mock.calls.length === 1).toBe(true);
  });
});
describe('Api.prototype.select : ', () => {
  test('it throws an error if is called with undefined id parameter', () => {
    expect.assertions(2);
    try {
      obj.select();
    } catch (er) {
      expect(1 === 1).toBe(true);
    }
    try {
      obj.select(undefined);
    } catch (er) {
      expect(1 === 1).toBe(true);
    }
  });
});
describe('context of callback options should be userProxy object : ', () => {
  test('ctx of onSelect', () => {
    expect.assertions(3);
    const options = {
      onSelect: jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
      }),
    };
    const obj = new apiConstructor(getDeps, {options});
    expect(options.onSelect.mock.calls.length === 0).toBe(true);
    obj.trigger('onSelect', obj.userProxy);
    expect(options.onSelect.mock.calls.length === 1).toBe(true);
  });
  test('ctx of onClose', () => {
    expect.assertions(3);
    const options = {
      onClose: jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
      }),
    };
    const obj = new apiConstructor(getDeps, {options});
    expect(options.onClose.mock.calls.length === 0).toBe(true);
    obj.trigger('onClose', obj.userProxy);
    expect(options.onClose.mock.calls.length === 1).toBe(true);
  });
  test('ctx of onOpen', () => {
    expect.assertions(3);
    const options = {
      onOpen: jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
      }),
    };
    const obj = new apiConstructor(getDeps, {options});
    expect(options.onOpen.mock.calls.length === 0).toBe(true);
    obj.trigger('onOpen', obj.userProxy);
    expect(options.onOpen.mock.calls.length === 1).toBe(true);
  });
  test('ctx of onInit', () => {
    expect.assertions(3);
    const options = {
      onInit: jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
      }),
    };
    const obj = new apiConstructor(getDeps, {options});
    expect(options.onInit.mock.calls.length === 0).toBe(true);
    obj.trigger('onInit', obj.userProxy);
    expect(options.onInit.mock.calls.length === 1).toBe(true);
  });
  test('ctx of onLoad', () => {
    expect.assertions(3);
    const options = {
      onLoad: jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
      }),
    };
    const obj = new apiConstructor(getDeps, {options});
    expect(options.onLoad.mock.calls.length === 0).toBe(true);
    obj.trigger('onLoad', obj.userProxy);
    expect(options.onLoad.mock.calls.length === 1).toBe(true);
  });
  test('ctx of onChange', () => {
    expect.assertions(3);
    const options = {
      onChange: jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
      }),
    };
    const obj = new apiConstructor(getDeps, {options});
    expect(options.onChange.mock.calls.length === 0).toBe(true);
    obj.trigger('onChange', obj.userProxy, {currentData: {}, previousData: {}, closedTabIDs: [], openTabIDs: []});
    expect(options.onChange.mock.calls.length === 1).toBe(true);
  });
});
describe('Api.prototype.eventHandlerFactory : ', () => {
  test('eventHandlerFactory method calls select function with switching=true if beforeSelect callback returned true', () => {
    expect.assertions(7);
    const id = '1';
    const e = {
      target: {
        className: 'rc-dyn-tabs-title',
      },
    };
    const parentElement = {
      className: 'rc-dyn-tabs-tab',
      lastChild: e.target,
    };
    e.target.parentElement = parentElement;

    // default beforeSelect
    Object.assign(obj, {select: jest.fn(() => Promise)});
    obj.eventHandlerFactory({id, e});
    expect(obj.select.mock.calls.length === 1).toBe(true);
    expect(obj.select.mock.calls[0][0] === id).toBe(true);

    // set beforeSelect to return false
    {
      let obj;
      const beforeSelect = jest.fn(() => false);
      obj = new apiConstructor(getDeps, {options: {beforeSelect}});
      Object.assign(obj, {select: jest.fn(() => Promise)});
      obj.eventHandlerFactory({id, e});
      expect(obj.select.mock.calls.length).toBe(0);
    }

    // set beforeSelect to return true
    {
      let obj;
      const beforeSelect = jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
        return true;
      });
      obj = new apiConstructor(getDeps, {options: {beforeSelect}});
      Object.assign(obj, {select: jest.fn(() => Promise)});
      obj.eventHandlerFactory({id, e});
      expect(obj.select.mock.calls.length).toBe(1);
      expect(beforeSelect.mock.calls[0][0]).toBe(e);
      expect(beforeSelect.mock.calls[0][1]).toBe(id);
    }
  });
  test('eventHandlerFactory method calls close function with switching=true if beforeClose callback returned true', () => {
    expect.assertions(8);
    const id = '1';
    const e = {
      target: {
        className: 'rc-dyn-tabs-close',
      },
    };
    const parentElement = {
      className: 'rc-dyn-tabs-tab',
      lastChild: e.target,
    };
    e.target.parentElement = parentElement;

    // default beforeClose
    Object.assign(obj, {close: jest.fn(() => Promise)});
    obj.eventHandlerFactory({id, e});
    expect(obj.close.mock.calls.length === 1).toBe(true);
    expect(obj.close.mock.calls[0][0] === id).toBe(true);
    expect(obj.close.mock.calls[0][1] === true).toBe(true);

    // set beforeClose to return false
    {
      let obj;
      const beforeClose = jest.fn(() => false);
      obj = new apiConstructor(getDeps, {options: {beforeClose}});
      Object.assign(obj, {close: jest.fn(() => Promise)});
      obj.eventHandlerFactory({id, e});
      expect(obj.close.mock.calls.length).toBe(0);
    }

    // set beforeClose to return true
    {
      let obj;
      const beforeClose = jest.fn(function () {
        expect(this === obj.userProxy).toBe(true);
        return true;
      });
      obj = new apiConstructor(getDeps, {options: {beforeClose}});
      Object.assign(obj, {close: jest.fn(() => Promise)});
      obj.eventHandlerFactory({id, e});
      expect(obj.close.mock.calls.length).toBe(1);
      expect(beforeClose.mock.calls[0][0]).toBe(e);
      expect(beforeClose.mock.calls[0][1]).toBe(id);
    }
  });
});
describe('Api.prototype.getCopyPerviousData', () => {
  test('returned data should be equal to optionsManager.initialState in onLoad event', () => {
    expect.assertions(2);
    obj.setOption('onLoad', function () {
      const perviousData = this.getCopyPerviousData();
      const data = this.getCopyData();
      expect(perviousData).toEqual(obj.optionsManager.initialState);
      expect(perviousData).not.toEqual(data);
    });
    obj.updateState({selectedTabID: 'tab1', openTabIDs: ['tab1', 'tab2']});
    obj.trigger('onLoad', obj.userProxy);
  });
  test('returned data should be equal to currentData in onLoad event', () => {
    expect.assertions(1);
    obj.setOption('onLoad', function () {
      expect(this.getCopyPerviousData()).toEqual(this.getCopyData());
    });
    obj.updateStateRef({selectedTabID: 'tab1', openTabIDs: ['tab1', 'tab2']}, () => {});
    obj.trigger('onLoad', obj.userProxy);
  });
  test('In the onLoad event, return data is equal to getInitialState() and getCopyData()', () => {
    expect.assertions(3);
    const _state = {selectedTabID: 'tab1', openTabIDs: ['tab1', 'tab2']};
    obj.setOption('onLoad', function () {
      const perviousData = this.getCopyPerviousData();
      const data = this.getCopyData();
      expect(perviousData).toEqual(_state);
      expect(perviousData).toEqual(data);
      expect(perviousData !== null).toBe(true);
    });
    obj.updateStateRef(_state, () => {});
    obj.trigger('onLoad', obj.userProxy);
  });
});
describe('Api.prototype.setTab : ', () => {
  test('it should call optionsManager.validateObjectiveTabData and validatePanelComponent internally', () => {
    obj.optionsManager.validateObjectiveTabData = jest.fn(() => obj.optionsManager);
    obj.optionsManager.validatePanelComponent = jest.fn(() => obj.optionsManager);
    obj.setTab('1', {title: 'c'});
    expect(obj.optionsManager.validateObjectiveTabData).toHaveBeenCalledBefore(
      obj.optionsManager.validatePanelComponent,
    );
  });
});
describe('Api.prototype._subscribeSelectedTabsHistory : ', () => {
  test('it should call "on" method', () => {
    obj.on = jest.fn(() => {});
    obj._subscribeSelectedTabsHistory();
    expect(obj.on.mock.calls.length).toBe(1);
    expect(obj.on.mock.calls[0][0]).toBe('onChange');
  });
  test('subscribed function should call activedTabsHistory.remove per each closed tabID when onChange event is triggered', () => {
    obj.activedTabsHistory.remove = jest.fn(() => {});
    const currentData = {selectedTabID: '2', openTabIDs: ['2']};
    const previousData = {selectedTabID: '2', openTabIDs: ['2']};
    const closedTabIDs = ['1', '3'];
    obj.trigger('onChange', obj.userProxy, {currentData, previousData, closedTabIDs, openTabIDs: []});
    expect(obj.activedTabsHistory.remove.mock.calls.length).toBe(2);
    expect(obj.activedTabsHistory.remove.mock.calls[0][0]).toBe('1');
    expect(obj.activedTabsHistory.remove.mock.calls[1][0]).toBe('3');
  });
  test(`when onChange event is triggered, subscribed function should call activedTabsHistory.add with 
        previously selectedTabID as a parameter if it is open, not selected and none disable.`, () => {
    obj.activedTabsHistory.add = jest.fn(() => {});
    obj.isOpen = jest.fn((id) => {
      if (id === '1' || id === '2') return true;
      return false;
    });
    obj.isSelected = jest.fn((id) => {
      if (id === '2') return true;
      return false;
    });
    const currentData = {selectedTabID: '2', openTabIDs: ['1', '2']};
    const previousData = {selectedTabID: '1', openTabIDs: ['1', '2']};
    obj.trigger('onChange', obj.userProxy, {currentData, previousData, closedTabIDs: [], openTabIDs: []});
    expect(obj.activedTabsHistory.add.mock.calls.length).toBe(1);
    expect(obj.activedTabsHistory.add.mock.calls[0][0]).toBe('1');
  });
});
describe('Api.prototype._getPreSelectedTabId : ', () => {
  test(`it calls activeTabsHistory.popLastTabID repeatedly until it returns a tabID 
    which is opened, not selected and none disable`, () => {
    const obj = new apiConstructor(getDeps, {
      options: {
        tabs: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}],
        selectedTabID: 'tab1',
      },
    });
    obj.stateRef = {selectedTabID: '1', openTabIDs: ['1', '2', '3', '4']};
    obj.activedTabsHistory.tabsId = ['3', '2', '1', '3', '1', '3', '4', '5'];
    obj.setTab('3', {disable: true}).setTab('4', {disable: true});
    const tabID = obj._getPreSelectedTabId();
    expect(tabID).toBe('2');
    expect(obj.activedTabsHistory.tabsId).toEqual(['3']);
  });
  test('it should return an empty string if activedTabsHistory.tabsId is empty or does not contain any valid tabID', () => {
    obj.stateRef = {selectedTabID: 'tab1', openTabIDs: ['tab1', 'tab2']};
    expect(obj._getPreSelectedTabId()).toBe('');
    obj.activedTabsHistory.tabsId = ['tab1'];
    expect(obj._getPreSelectedTabId()).toBe('');
    obj.activedTabsHistory.tabsId = ['tab1', ' ', '', null, 'tab2'];
    obj.setTab('tab2', {disable: true});
    expect(obj._getPreSelectedTabId()).toBe('');
    obj.activedTabsHistory.tabsId = ['tab1', 'tab2'];
    obj.setTab('tab2', {disable: false});
    expect(obj._getPreSelectedTabId()).toBe('tab2');
  });
});
describe('Api.prototype._getPreSiblingTabId : ', () => {
  test('it should call helper.filterArrayUntilFirstValue with appropriate parameters', () => {
    obj.helper.filterArrayUntilFirstValue = jest.fn(() => {});
    obj.stateRef = {selectedTabID: '2', openTabIDs: ['1', '2', '3']};
    obj._getPreSiblingTabId();
    expect(obj.helper.filterArrayUntilFirstValue.mock.calls.length).toBe(1);
    expect(obj.helper.filterArrayUntilFirstValue.mock.calls[0][0]).toEqual(['1']);
    expect(obj.helper.filterArrayUntilFirstValue.mock.calls[0][2]).toBe(true);
  });
});
describe('Api.prototype._getNextSiblingTabId : ', () => {
  test('it should call helper.filterArrayUntilFirstValue with appropriate parameters', () => {
    obj.helper.filterArrayUntilFirstValue = jest.fn(() => {});
    obj.stateRef = {selectedTabID: '2', openTabIDs: ['1', '2', '3']};
    obj._getNextSiblingTabId();
    expect(obj.helper.filterArrayUntilFirstValue.mock.calls.length).toBe(1);
    expect(obj.helper.filterArrayUntilFirstValue.mock.calls[0][0]).toEqual(['3']);
    expect(!obj.helper.filterArrayUntilFirstValue.mock.calls[0][2]).toBe(true);
  });
});
