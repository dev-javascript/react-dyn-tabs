import React, { useState } from "react"
import { render, unmountComponentAtNode } from "react-dom";
import useDynTabs from "./useDynamicTabs.js";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
let container = document.createElement("div");
let op = '';//options
beforeAll(() => {
    document.body.appendChild(container);
});
beforeEach(() => {
    op = {
        tabs: [{
            id: '1',
            title: 'mock tab 1',
            closable: true,
            panelComponent: <p>tab1 content</p>
        }, {
            id: '2',
            title: 'mock tab 2',
            iconClass: 'ui-icon ui-icon-seek-end',
            closable: false,
            panelComponent: <p>tab2 content</p>
        }],
        selectedTabID: '1',
        onSelect: jest.fn(function () { }),
        onChange: jest.fn(function () { }),
        onInit: jest.fn(function () { }),
        onClose: jest.fn(function () { }),
        onOpen: jest.fn(function () { }),
        onLoad: jest.fn(function () { }),
        beforeClose: jest.fn(function () { }),
        beforeSelect: jest.fn(function () { })
    };
});
afterEach(() => {
    unmountComponentAtNode(container);
    container.innerHTML = "";
});
afterAll(() => {
    document.body.removeChild(container);
    container = null;
});
describe("actions", () => {
    test('selecting tab', () => {
        let _api;
        act(() => {
            const App = function (props) {
                const [Tablist, Panellist, api] = useDynTabs(op);
                _api = api;
                return (
                    <div>
                        <Tablist></Tablist>
                        <Panellist></Panellist>
                    </div>
                );
            };
            render(<App></App>, container);
            _api.select('2');
        });
        expect(document.querySelector('[tab-id="2"]').className.includes('rc-dyn-tabs-selected')).toBe(true);
        expect(op.onSelect.mock.calls.length).toBe(1);
        expect(op.onLoad.mock.calls.length).toBe(1);
    });
    test('opening new tab and closing selected tab', () => {
        let _api;
        act(() => {
            const App = function (props) {
                const [Tablist, Panellist, api] = useDynTabs(op);
                _api = api;
                return (
                    <div>
                        <Tablist></Tablist>
                        <Panellist></Panellist>
                    </div>
                );
            };
            render(<App></App>, container);
            _api.open({
                id: '3',
                title: 'mock tab 3',
                closable: true,
                panelComponent: <p>tab3 content</p>
            });
            _api.close('1');
        });
        expect(_api.isOpen('3')).toBe(true);
        expect(_api.isOpen('1')).toBe(false);
        expect(_api.isSelected('3')).toBe(false);
        expect(_api.isSelected('1')).toBe(false);
        expect(_api.isSelected('2')).toBe(true);
        expect(document.querySelector('[tab-id="3"]') != null).toBe(true);
        expect(document.querySelector('[tab-id="2"]').className.includes('rc-dyn-tabs-selected')).toBe(true);
    });
    test('set options and tab data + call refresh', () => {
        let _api, counter = 0;
        act(() => {
            const App = function (props) {
                const [Tablist, Panellist, api] = useDynTabs(op);
                _api = api;
                return (
                    <div>
                        <Tablist></Tablist>
                        <Panellist></Panellist>
                    </div>
                );
            };
            render(<App></App>, container);
            _api.setTab('1', { closable: false });
            _api.setOption('direction', 'rtl');
            _api.setOption('tabComponent', function (props) {
                return (
                    <a  {...props.tabProps}>
                        {props.children}
                        {
                            props.hasOwnProperty('iconProps') &&
                            <span {...props.iconProps}></span>
                        }
                    </a>
                );
            });
            _api.on('onInit', function () {
                if (!counter) {
                    counter++;
                    this.setTab('1', {
                        panelComponent: function (props) {
                            return <div id="updatedPanel1"></div>;
                        }
                    }).refresh();
                }
            });
            _api.refresh();
        });
        expect(document.getElementById('updatedPanel1') != null).toBe(true);
        expect(document.querySelector('li[tab-id="1"] .rc-dyn-tabs-close') == null).toBe(true);
        expect(document.querySelector('ul').className.includes('rc-dyn-tabs-rtl')).toBe(true);
        expect(document.querySelectorAll('a.rc-dyn-tabs-title').length === 2).toBe(true);
        expect(op.onChange.mock.calls.length).toBe(0);
        expect(op.onInit.mock.calls.length).toBe(3);
    });
});
describe("events", () => {
    test('checking events execution count and their parameters ', () => {
        let _api, contextProps = '';
        const onSelectHandler = jest.fn(function (param) {
            expect(contextProps === Object.keys(this).join()).toBe(true);
        });
        const op = {
            tabs: [{
                id: '1',
                title: 'mock tab 1',
                closable: true,
                panelComponent: <p>tab1 content</p>
            }, {
                id: '2',
                title: 'mock tab 2',
                iconClass: 'ui-icon ui-icon-seek-end',
                closable: false,
                panelComponent: <p>tab2 content</p>
            }],
            selectedTabID: '1',
            onSelect: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); }),
            onChange: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); }),
            onInit: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); }),
            onClose: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); }),
            onOpen: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); }),
            onLoad: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); }),
            beforeClose: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); }),
            beforeSelect: jest.fn(function () { expect(contextProps === Object.keys(this).join()).toBe(true); })
        };
        act(() => {
            const App = function (props) {
                const [Tablist, Panellist, api] = useDynTabs(op);
                _api = api;
                if (!contextProps) {
                    contextProps = Object.keys(api).join();
                }
                return (
                    <div>
                        <Tablist></Tablist>
                        <Panellist></Panellist>
                    </div>
                );
            };
            render(<App></App>, container);
            _api.on('onSelect', onSelectHandler);
            _api.open({
                id: '3',
                title: 'mock tab 3',
                closable: true,
                panelComponent: <p>tab3 content</p>
            });
            _api.close('1');
        });
        //onload
        expect(op.onLoad.mock.calls.length).toBe(1);
        //onInit
        expect(op.onInit.mock.calls.length).toBe(2);
        //onchange
        expect(op.onChange.mock.calls.length).toBe(1);
        expect(Object.prototype.toString.call(op.onChange.mock.calls[0][0]) === '[object Object]').toBe(true);
        expect(op.onChange.mock.calls[0][0].hasOwnProperty('currentData')).toBe(true);
        expect(op.onChange.mock.calls[0][0].hasOwnProperty('perviousData')).toBe(true);
        //onSelect 
        expect(onSelectHandler.mock.calls.length).toBe(1);
        expect(op.onSelect.mock.calls.length).toBe(1);
        expect(Object.prototype.toString.call(op.onSelect.mock.calls[0][0]) === '[object Object]').toBe(true);
        expect(Object.prototype.toString.call(onSelectHandler.mock.calls[0][0]) === '[object Object]').toBe(true);
        expect(op.onSelect.mock.calls[0][0].hasOwnProperty('currentSelectedTabId')).toBe(true);
        expect(onSelectHandler.mock.calls[0][0].hasOwnProperty('currentSelectedTabId')).toBe(true);
        expect(op.onSelect.mock.calls[0][0].hasOwnProperty('perviousSelectedTabId')).toBe(true);
        expect(onSelectHandler.mock.calls[0][0].hasOwnProperty('perviousSelectedTabId')).toBe(true);
        //onclose 
        expect(op.onClose.mock.calls.length).toBe(1);
        expect(op.onClose.mock.calls[0][0].constructor === Array && op.onClose.mock.calls[0][0][0] === '1').toBe(true);
        //onopen
        expect(op.onOpen.mock.calls.length).toBe(1);
        expect(op.onOpen.mock.calls[0][0].constructor === Array && op.onOpen.mock.calls[0][0][0] === '3').toBe(true);
        //beforeClose
        expect(op.beforeClose.mock.calls.length).toBe(0);
        //beforeSelect
        expect(op.beforeSelect.mock.calls.length).toBe(0);
    });
    test('onChange, onInit and onLoad are called initially', () => {
        let _api;
        act(() => {
            const App = function (props) {
                const [Tablist, Panellist, api] = useDynTabs(op);
                _api = api;
                return (
                    <div>
                        <Tablist></Tablist>
                        <Panellist></Panellist>
                    </div>
                );
            };
            render(<App></App>, container);
        });
        expect(op.onChange.mock.calls.length).toBe(0);
        expect(op.onLoad.mock.calls.length).toBe(1);
        expect(op.onInit.mock.calls.length).toBe(1);
    });
});