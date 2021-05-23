import OptionManager from './optionManager.js';
import React from 'react';
let obj;
beforeEach(() => {
    const options = {};
    obj = new (OptionManager)({ options });
});
afterEach(() => {
    obj = null;
});
describe('OptionManager.prototype.validateTabData :  ', () => {
    test('validateTabData method should work correctly with empty object as a parameter', () => {
        const tabData = obj.validateTabData({});
        expect(tabData.hasOwnProperty('title')).toBe(true);
        expect(tabData.hasOwnProperty('tooltip')).toBe(true);
        expect(typeof tabData.panelComponent === 'function').toBe(true);
        expect(tabData.closable === true).toBe(true);
        expect(tabData.hasOwnProperty('iconClass')).toBe(true);
        expect(tabData.disable === false).toBe(true);
        expect(typeof tabData.id === 'string').toBe(true);
    });
    test('validateTabData method should work correctly when is called with parameters', () => {
        const panelComponent = props => <p></p>;
        const tabData = obj.validateTabData({
            id: '3', title: 'a', tooltip: 't', panelComponent, closable: false, iconClass: 'c', disable: true
        });
        expect(tabData.title === 'a').toBe(true);
        expect(tabData.tooltip === 't').toBe(true);
        expect(tabData.panelComponent === panelComponent).toBe(true);
        expect(tabData.closable === false).toBe(true);
        expect(tabData.iconClass === 'c').toBe(true);
        expect(tabData.disable === true).toBe(true);
        expect(tabData.id === '3').toBe(true);
    });
    test('validateTabData method should convert a number id into string id', () => {
        const tabData = obj.validateTabData({ id: 3 });
        expect(tabData.id === '3').toBe(true);
    });
    test('it should throw an error when is called with an none real object param', () => {
        expect.assertions(2);
        let tabData;
        try {
            tabData = obj.validateTabData([]);
        } catch (er) {
            expect(typeof tabData === 'undefined').toBe(true);
            expect(er.message === 'tabData must be type of Object').toBe(true);
        }
    });
    test('it should work correctly when is called with a react element as a panelComponent parameter', () => {
        const tabData = obj.validateTabData({ panelComponent: <div></div> });
        expect(tabData.hasOwnProperty('title')).toBe(true);
        expect(tabData.hasOwnProperty('tooltip')).toBe(true);
        expect(typeof tabData.panelComponent === 'function').toBe(true);
        expect(tabData.closable === true).toBe(true);
        expect(tabData.hasOwnProperty('iconClass')).toBe(true);
        expect(tabData.disable === false).toBe(true);
        expect(typeof tabData.id === 'string').toBe(true);
    });
});


