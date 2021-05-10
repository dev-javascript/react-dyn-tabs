import Tabs from './tabs.js';
import React from 'react';
let obj, defaultPanelComponent;
beforeEach(() => {
    obj = new (Tabs)();
    defaultPanelComponent = function (props) { return <p></p> };
});
afterEach(() => {
    obj = null;
    defaultPanelComponent = null;
});
describe('Tabs.prototype._addTab :  ', () => {
    test('_addTab method should work correctly with empty object as a parameter', () => {
        const tabData = obj._addTab({}, { defaultPanelComponent });
        expect(tabData.hasOwnProperty('title')).toBe(true);
        expect(tabData.hasOwnProperty('tooltip')).toBe(true);
        expect(typeof tabData.panelComponent === 'function').toBe(true);
        expect(tabData.closable === true).toBe(true);
        expect(tabData.hasOwnProperty('iconClass')).toBe(true);
        expect(tabData.disable === false).toBe(true);
        expect(typeof tabData.id === 'string').toBe(true);
    });
    test('_addTab method should work correctly when is called with parameters', () => {
        const panelComponent = props => <p></p>;
        const tabData = obj._addTab({
            id: '3', title: 'a', tooltip: 't', panelComponent, closable: false, iconClass: 'c', disable: true
        }, { defaultPanelComponent });
        expect(tabData.title === 'a').toBe(true);
        expect(tabData.tooltip === 't').toBe(true);
        expect(tabData.panelComponent === panelComponent).toBe(true);
        expect(tabData.closable === false).toBe(true);
        expect(tabData.iconClass === 'c').toBe(true);
        expect(tabData.disable === true).toBe(true);
        expect(tabData.id === '3').toBe(true);
    });
    test('_addTab method should convert a number id into string id', () => {
        const panelComponent = props => <p></p>;
        const tabData = obj._addTab({ id: 3 }, { defaultPanelComponent });
        expect(tabData.id === '3').toBe(true);
    });
    test('_addTab method should throw an error when is called with an none real object param', () => {
        expect.assertions(2);
        let tabData;
        try {
            tabData = obj._addTab([], { defaultPanelComponent });
        } catch (er) {
            expect(typeof tabData === 'undefined').toBe(true);
            expect(er.message === 'tabData must be type of Object').toBe(true);
        }
    });
    test('_addTab method should work correctly when is called with a react element as a panelComponent parameter', () => {
        const tabData = obj._addTab({ panelComponent: <div></div> }, { defaultPanelComponent });
        expect(tabData.hasOwnProperty('title')).toBe(true);
        expect(tabData.hasOwnProperty('tooltip')).toBe(true);
        expect(typeof tabData.panelComponent === 'function').toBe(true);
        expect(tabData.closable === true).toBe(true);
        expect(tabData.hasOwnProperty('iconClass')).toBe(true);
        expect(tabData.disable === false).toBe(true);
        expect(typeof tabData.id === 'string').toBe(true);
    });
});


