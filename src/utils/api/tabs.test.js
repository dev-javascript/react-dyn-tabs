import Tabs from './tabs.js';
import React from 'react';
import {TestScheduler} from 'jest';
let obj;
beforeEach(() => {
  obj = new Tabs();
});
afterEach(() => {
  obj = null;
});
describe('Tabs constructor :  ', () => {
  test('it should call _addTab for each initialTab data', () => {
    const addTab = Tabs.prototype._addTab;
    Tabs.prototype._addTab = jest.fn(() => {});
    new Tabs({initialTabs: [{}, {}]});
    new Tabs({});
    expect(Tabs.prototype._addTab.mock.calls.length).toBe(2);
    Tabs.prototype._addTab = addTab;
  });
  test('its _data property should be equal to initialTabs array', () => {
    const initialTabs = [{a: 2}, {b: 3}];
    const obj = new Tabs({initialTabs});
    expect(obj._data).toEqual(initialTabs);
  });
});
