import OptionManager from './optionManager.js';
import React from 'react';
import DefaultOptions from './defaultOptions.js';
import DefaultTabInnerComponent from '../../../tab/defaulTabInner.js';
let obj;
beforeEach(() => {
    const options = {
        tabs: [{ id: '1', title: 'a' }, { id: '2', title: 'b' }]
    };
    obj = new (OptionManager)({ options });
});
afterEach(() => {
    obj = null;
});
describe('OptionManager constructor : ', () => {
    test('it should throw an error when is called with undefined parameter', () => {
        expect.assertions(2);
        try {
            const obj = new (OptionManager)();
        } catch (er) {
            expect(1).toBe(1);
        }
        try {
            const obj = new (OptionManager)(undefined);
        } catch (er) {
            expect(1).toBe(1);
        }
    });
    test('object parameter should have options property', () => {
        expect.assertions(1);
        try {
            const obj = new (OptionManager)({});
        } catch (er) {
            expect(1).toBe(1);
        }
    });
    test('parameter should be type of an object', () => {
        expect.assertions(1);
        try {
            const obj = new (OptionManager)([]);
        } catch (er) {
            expect(1).toBe(1);
        }
    });
    test('structure of setting property', () => {
        const _setting = {
            tabClass: 'rc-dyn-tabs-tab',
            titleClass: 'rc-dyn-tabs-title',
            iconClass: 'rc-dyn-tabs-icon',
            selectedClass: 'rc-dyn-tabs-selected',
            hoverClass: 'rc-dyn-tabs-hover',
            tablistClass: 'rc-dyn-tabs-tablist',
            closeClass: 'rc-dyn-tabs-close',
            panelClass: 'rc-dyn-tabs-panel',
            panellistClass: 'rc-dyn-tabs-panellist',
            disableClass: 'rc-dyn-tabs-disable',
            ltrClass: 'rc-dyn-tabs-ltr',
            rtlClass: 'rc-dyn-tabs-rtl',
            panelIdTemplate: expect.any(Function),
            ariaLabelledbyIdTemplate: expect.any(Function),
            getDefaultTabData: expect.any(Function)
        };
        expect(obj.setting).toEqual(_setting);
    });
    test('setting.panelIdTemplate should return result correctly', () => {
        expect(obj.setting.panelIdTemplate('2')).toBe('rc-dyn-tabs-p-2');
    });
    test('setting.ariaLabelledbyIdTemplate should return result correctly', () => {
        expect(obj.setting.ariaLabelledbyIdTemplate('2')).toBe('rc-dyn-tabs-l-2');
    });
    test('setting.getDefaultTabData should return result correctly', () => {
        const defaultTabData = obj.setting.getDefaultTabData();
        expect(defaultTabData).toEqual({
            title: "",
            tooltip: "",
            panelComponent: obj.options.defaultPanelComponent,
            closable: true,
            iconClass: "",
            disable: false,
            id: defaultTabData.id
        });
        expect(defaultTabData.id.includes('tab_')).toBe(true);
    });
});
describe('OptionManager options prop : ', () => {
    test('it should be equal to defaultOptions if options parameter is an empty object', () => {
        const obj = new (OptionManager)({ options: {} });
        expect(obj.options).toEqual(obj._defaultOptions);
    });
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
describe('OptionManager.prototype.setOption : ', () => {
    it('it can not set tabs option', () => {
        const tabs = obj.getOption('tabs');
        obj.setOption('tabs', [{ id: '3', title: 'c' }]);
        const newTabs = obj.getOption('tabs');
        expect(tabs).toBe(newTabs);
    });
    it('it can not set selectedTabID option', () => {
        const selectedTabID = obj.getOption('selectedTabID');
        obj.setOption('selectedTabID', '2');
        const newSelectedTabID = obj.getOption('selectedTabID');
        expect(selectedTabID).toBe(newSelectedTabID);
    });
});
describe('OptionManager.prototype.getOption : ', () => {
    it('it returns tabs prop as an immutable array', () => {
        const newTitle = 'newTitle';
        let oldTitle;
        const tabs = obj.getOption('tabs');
        oldTitle = tabs[0].title;
        tabs[0].title = newTitle;
        const newTabs = obj.getOption('tabs');
        expect(newTabs[0].title).toBe(oldTitle);
    });
    it('it returns undefined when it is called with wrong option name', () => {
        const result = obj.getOption('Tabs');
        expect(result).toBe(undefined);
    });
});



