import React from 'react';
import ReactDom from 'react-dom';
import Tab from './tab';
import { act } from 'react-dom/test-utils';
let container = document.createElement('div'), realUseContext, useContextMock;
const _getMutableCurrentOptions = () => (() => ({
    data: {
        allTabs: {
            '1': { id: 1, title: 'a1' },
            '2': { id: 2, title: 'a3' },
            '3': { id: 3, title: 'a2' }
        }
    },
    classNames: { tab: 'defaultTab', activeTab: 'activeTab' }
})), _beforeTest = ({ option, apiObj }) => {
    document.body.appendChild(container);
    realUseContext = React.useContext;
    const _api = {
        getMutableCurrentOptions: option,
        stackedEvent: { afterActiveTab: [] },
        tabDidUpdate: jest.fn(({ tabId, isActive, counter }) => { }),
        tabDidMount: jest.fn(({ tabId, isActive }) => { }),
        activeTabEventHandler: jest.fn(() => { })
    };
    apiObj && Object.assign(_api, apiObj);
    useContextMock = React.useContext = jest.fn(() => _api);
};
beforeAll(() => _beforeTest({ option: _getMutableCurrentOptions() }));
beforeEach(() => { });
afterAll(() => {
    document.body.removeChild(container);
    container = null;
    React.useContext = realUseContext;
});
afterEach(() => {
    ReactDom.unmountComponentAtNode(container);
    container.innerHTML = '';
});
test('incorrect tab id format !', () => {
    act(() => { ReactDom.render(<Tab id='1' activeTabId='2'></Tab>, container); });
    expect(document.getElementById('tab_1')).not.toBe(null);
});
describe('tab classes', () => {
    test('only activeTab must have an "active" class and all tabs must have a "nestedTab_tab" class', () => {
        act(() => {
            ReactDom.render(<><Tab id='1' activeTabId='1'></Tab><Tab id='2' activeTabId='1'></Tab></>
                , container);
        });
        const t1c = document.getElementById('tab_1').className, t2c = document.getElementById('tab_2').className;
        expect(t1c.includes('active')).toBe(true);
        expect(t1c.includes('nestedTab_tab')).toBe(true);
        expect(t2c.includes('active')).toBe(false);
        expect(t2c.includes('nestedTab_tab')).toBe(true);
        //tab can switch from another tab
    });
    test('tab should have some user defined classes includes "tab,activeTab"', () => {
        act(() => {
            ReactDom.render(<><Tab id='1' activeTabId='1'></Tab><Tab id='2' activeTabId='1'></Tab></>
                , container);
        });
        expect(document.getElementById('tab_1').className.includes('activeTab')).toBe(true);
        expect(document.getElementById('tab_2').className.includes('defaultTab')).toBe(true);
    });
});
describe('tab mouse events', () => {
    test(`tab must implement mousedown, click and mouseup events and all of them must call 
          activeTabEventHandler`, () => {
        const activeTabEventHandler = jest.fn(() => { });
        _beforeTest({ option: _getMutableCurrentOptions(), apiObj: { activeTabEventHandler } });
        act(() => {
            ReactDom.render(<>
                <Tab id='1' activeTabId='1'></Tab><Tab id='2' activeTabId='1'></Tab>
            </>, container);
        });
        const tab1El = document.getElementById('tab_1'), tab2El = document.getElementById('tab_2');
        tab1El.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        tab1El.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        tab1El.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        tab2El.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        tab2El.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        tab2El.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        expect(activeTabEventHandler).toHaveBeenCalledTimes(6);
    });
});
describe('tab useEffect', () => {
    test(`tabDidMount will be called in the first execution of tabComponent and not for next executions`, () => {
        const tabDidUpdate = jest.fn(({ tabId, isActive, counter }) => { }),
            tabDidMount = jest.fn(({ tabId, isActive }) => { });
        _beforeTest({ option: _getMutableCurrentOptions(), apiObj: { tabDidMount, tabDidUpdate } });
        act(() => {
            ReactDom.render(<Tab activeTabId='2' id='1'></Tab>, container);
        });
        act(() => {
            document.getElementById('tab_1').dispatchEvent(new MouseEvent('clik', { bubbles: true }));
        });
        expect(tabDidMount).toHaveBeenCalledTimes(1);
        expect(tabDidMount).toHaveBeenCalledWith({ tabId: '1', isActive: false });
    });
    test(`tabDidUpdate may is called in the first execution of tabComponent`, () => {

    });
    test(`tabDidUpdate must be called after switching between tabs`, () => {

    });
    test(`tabDidUpdate may not be called after a force update`, () => {

    });
});
//recieve string activeTabId and  string id as props
//getSnapshot => it must return li element which has an id attribute

//hover mode

