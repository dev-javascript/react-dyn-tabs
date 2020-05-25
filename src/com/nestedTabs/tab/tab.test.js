import React from 'react';
import ReactDom from 'react-dom';
import Tab from './tab';
import { act } from 'react-dom/test-utils';
let container = document.createElement('div'), realUseContext, useContextMock;
const activeTabEventHandler = jest.fn(() => { });
beforeAll(() => {
    document.body.appendChild(container);
    realUseContext = React.useContext;
    useContextMock = React.useContext = jest.fn(() => ({
        getMutableCurrentOptions: () => ({
            data: {
                allTabs: {
                    '1': { id: 1, title: 'a1' },
                    '2': { id: 2, title: 'a3' },
                    '3': { id: 3, title: 'a2' }
                }
            },
            classNames: { tab: 'defaultTab', activeTab: 'activeTab' }
        }),
        stackedEvent: { afterActiveTab: [] },
        activeTabEventHandler
    }));
});
beforeEach(() => { container.innerHTML = ''; });
afterAll(() => {
    document.body.removeChild(container);
    container = null;
    React.useContext = realUseContext;
});
afterEach(() => {
    ReactDom.unmountComponentAtNode(container);
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
describe('tab events', () => {
    test(`tab must implement mousedown, click and mouseup events and all of them must call 
          activeTabEventHandler`, () => {
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
    test(`first execution of tab component must call api.tabDidMount() and next executions
          of it must call api.tabDidUpdate`, () => {

    });
});
//tab can be opend
//tab can be closed
//tab can switch from another tab
//calling appropiat events for switching tabs
//calling appropiat events for close tab
//calling appropiat events for open tab
//calling beforeActiveTab event right after user action for activing tab
//calling onMount and onUnMount and didUpdate event
//recieve props id with string type
//tab must has at least a title and panelComponent data
//getSnapshot => it must return li element which has an id attribute
//hover mode

//useEffect should
//tab should have a forceUpdate method
//mutate option.events

