import React, { useState } from "react"
import { render, unmountComponentAtNode } from "react-dom";
import useDynTabs from "./index.js";
import { act } from "react-dom/test-utils";
let container = document.createElement("div");
let App, instance, ready, renderApp, op;//options
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
        beforeSelect: jest.fn(function () { }),
        onDestroy: jest.fn(function () { })
    };
    App = function (props) {
        const [Tablist, Panellist, readyFunction] = useDynTabs(op);
        ready = readyFunction;
        readyFunction(instanceParam => {
            instance = instanceParam;
        });
        return (
            <div>
                <Tablist></Tablist>
                <Panellist></Panellist>
            </div>
        );
    };
    renderApp = () => { act(() => { render(<App></App>, container); }) };
});
afterEach(() => {
    unmountComponentAtNode(container);
    container.innerHTML = "";
    App = null;
    instance = null;
    op = null;
    ready = null;
    renderApp = null;
});
afterAll(() => {
    document.body.removeChild(container);
    container = null;
});
describe("apply multiple actions : ", () => {
    test('calling close function when select action is done', () => {
        expect.assertions(1);
        renderApp();
        return act(() => {
            return instance.select('2').then(result => {
                return instance.close('2').then(result => {
                    expect(document.querySelector('[tab-id="1"]').className.includes('rc-dyn-tabs-selected')).toBe(true);
                });
            });
        });
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
        });
        act(() => {
            if (_api.isOpen('3') == false)
                _api.open({
                    id: '3',
                    title: 'mock tab 3',
                    closable: true,
                    panelComponent: <p>tab3 content</p>
                });
            if (_api.isOpen('1'))
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
        renderApp();
        act(() => {
            if (instance.getTab('1').closable == true)
                instance.setTab('1', { closable: false });
            if (instance.getOption('direction') === 'ltr') {
                instance.setOption('direction', 'rtl');
                instance.setOption('tabComponent', function (props) {
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
                instance.one('onInit', function () {
                    this.setTab('1', {
                        panelComponent: function (props) {
                            return <div id="updatedPanel1"></div>;
                        }
                    }).refresh();
                });
                instance.refresh();
            }
        });
        expect(document.getElementById('updatedPanel1') != null).toBe(true);
        expect(document.querySelector('li[tab-id="1"] .rc-dyn-tabs-close') == null).toBe(true);
        expect(document.querySelector('ul').className.includes('rc-dyn-tabs-rtl')).toBe(true);
        expect(document.querySelectorAll('a.rc-dyn-tabs-title').length === 2).toBe(true);
        expect(op.onChange.mock.calls.length).toBe(0);
        expect(op.onInit.mock.calls.length).toBe(3);
    });
    test('checking events execution count', () => {
        expect.assertions(9);
        const onSelectHandler = jest.fn(() => { });
        renderApp();
        act(() => {
            instance.one('onSelect', onSelectHandler);
            instance.open({
                id: '3',
                title: 'mock tab 3',
                closable: true,
                panelComponent: <p>tab3 content</p>
            });
            instance.close('1');
        });
        expect(op.onLoad.mock.calls.length).toBe(1);
        expect(op.onInit.mock.calls.length).toBe(2);
        expect(op.onChange.mock.calls.length).toBe(1);
        expect(onSelectHandler.mock.calls.length).toBe(1);
        expect(op.onSelect.mock.calls.length).toBe(1);
        expect(op.onClose.mock.calls.length).toBe(1);
        expect(op.onOpen.mock.calls.length).toBe(1);
        expect(op.beforeClose.mock.calls.length).toBe(0);
        expect(op.beforeSelect.mock.calls.length).toBe(0);
    });
});
describe("calling some action inside the events options", () => {
    test("select method can be called inside the onLoad option", () => {
        op.onLoad = jest.fn(function () { this.select('2'); });
        renderApp();
        expect(instance.getCopyData().selectedTabID === '2').toBe(true);
        expect(op.onLoad.mock.calls.length === 1).toBe(true);
        expect(op.onInit.mock.calls.length === 2).toBe(true);
        expect(op.onChange.mock.calls.length === 1).toBe(true);
        expect(op.onSelect.mock.calls.length === 1).toBe(true);
    });
});
describe('select method : ', () => {
    test('it should fire onInit event then onChange and then onSelect evnets', () => {
        const onSelect = jest.fn(() => { });
        renderApp();
        act(() => { instance.one('onSelect', onSelect).select('2'); });
        expect(op.onInit.mock.calls.length === 2).toBe(true);
        expect(op.onChange.mock.calls.length === 1).toBe(true);
        expect(op.onSelect.mock.calls.length === 1).toBe(true);
        expect(op.onSelect.mock.calls[0][0]).toEqual({ currentSelectedTabId: "2", perviousSelectedTabId: "1" });
        expect(onSelect.mock.calls[0][0]).toEqual({ currentSelectedTabId: "2", perviousSelectedTabId: "1" });
        expect(op.onInit).toHaveBeenCalledBefore(op.onChange);
        expect(op.onChange).toHaveBeenCalledBefore(op.onSelect);
        expect(op.onSelect).toHaveBeenCalledBefore(onSelect);
    });
    test('select Promise is resolved with {currentData,instance} parameter after onSelect event', () => {
        expect.assertions(6);
        renderApp();
        return act(() => {
            return instance.select('2').then(result => {
                expect(result.currentData).toEqual(instance.getCopyData());
                expect(result.instance).toBe(instance);
                expect(document.querySelector('[tab-id="2"]').className.includes('rc-dyn-tabs-selected')).toBe(true);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
                expect(op.onChange.mock.calls.length === 1).toBe(true);
                expect(op.onSelect.mock.calls.length === 1).toBe(true);
            });
        });
    });
    test('select a tab twice', () => {
        expect.assertions(2);
        renderApp();
        return act(() => {
            return instance.select('1').then(result => {
                expect(op.onChange.mock.calls.length === 0).toBe(true);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
            });
        });
    });
    test('selecting none existent tab', () => {
        expect.assertions(4);
        renderApp();
        return act(() => {
            return instance.select('3').then(result => {
                expect(document.querySelector('.rc-dyn-tabs-selected') == null).toBe(true);
                expect(instance.getCopyData().selectedTabID === '3').toBe(true);
                expect(op.onChange.mock.calls.length === 1).toBe(true);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
            });
        });
    });
});
describe('close method : ', () => {
    test('it should fire onInit event then onChange and then onClose evnets', () => {
        const onClose = jest.fn(() => { });
        renderApp();
        act(() => { instance.one('onClose', onClose).close('2'); });
        expect(op.onInit.mock.calls.length === 2).toBe(true);
        expect(op.onChange.mock.calls.length === 1).toBe(true);
        expect(op.onClose.mock.calls.length === 1).toBe(true);
        expect(op.onClose.mock.calls[0][0]).toEqual(['2']);
        expect(onClose.mock.calls[0][0]).toEqual(['2']);
        expect(op.onInit).toHaveBeenCalledBefore(op.onChange);
        expect(op.onChange).toHaveBeenCalledBefore(op.onClose);
        expect(op.onClose).toHaveBeenCalledBefore(onClose);
    });
    test('close Promise is resolved with {currentData,instance} parameter after onClose event', () => {
        expect.assertions(6);
        renderApp();
        return act(() => {
            return instance.close('2').then(result => {
                expect(result.currentData).toEqual(instance.getCopyData());
                expect(result.instance).toBe(instance);
                expect(document.querySelector('[tab-id="1"]').className.includes('rc-dyn-tabs-selected')).toBe(true);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
                expect(op.onChange.mock.calls.length === 1).toBe(true);
                expect(op.onClose.mock.calls.length === 1).toBe(true);
            });
        });
    });
    test('close a none opened tab', () => {
        expect.assertions(2);
        renderApp();
        return act(() => {
            return instance.close('4').then(result => {
                expect(op.onChange.mock.calls.length === 0).toBe(true);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
            });
        });
    });
});
describe('open method : ', () => {
    test('it should fire onInit event then onChange and then onOpen evnets', () => {
        const onOpen = jest.fn(() => { });
        renderApp();
        act(() => {
            instance.one('onOpen', onOpen).open({
                id: '3',
                title: 'tab3'
            });
            instance.open({
                id: '4',
                title: 'tab4'
            });
        });
        expect(op.onInit.mock.calls.length === 2).toBe(true);
        expect(op.onChange.mock.calls.length === 1).toBe(true);
        expect(op.onOpen.mock.calls.length === 1).toBe(true);
        expect(op.onOpen.mock.calls[0][0]).toEqual(['3', '4']);
        expect(onOpen.mock.calls[0][0]).toEqual(['3', '4']);
        expect(op.onInit).toHaveBeenCalledBefore(op.onChange);
        expect(op.onChange).toHaveBeenCalledBefore(op.onOpen);
        expect(op.onOpen).toHaveBeenCalledBefore(onOpen);
    });
    test('open Promise is resolved with {currentData,instance} parameter after onOpen event', () => {
        expect.assertions(5);
        renderApp();
        return act(() => {
            return instance.open({
                id: '3',
                title: 'tab3'
            }).then(result => {
                expect(result.currentData).toEqual(instance.getCopyData());
                expect(result.instance).toBe(instance);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
                expect(op.onChange.mock.calls.length === 1).toBe(true);
                expect(op.onOpen.mock.calls.length === 1).toBe(true);
            });
        });
    });
    test('open a tab twice', () => {
        expect.assertions(3);
        renderApp();
        return act(() => {
            return instance.open(op.tabs[0]).then(result => {
                expect(op.onChange.mock.calls.length === 0).toBe(true);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
                expect(instance.getCopyData().openTabIDs.length === 2).toBe(true);
            });
        });
    });
});
describe('refresh method : ', () => {
    test('it should fire onInit event', () => {
        renderApp();
        act(() => { instance.refresh(); });
        expect(op.onInit.mock.calls.length === 2).toBe(true);
        expect(op.onChange.mock.calls.length === 0).toBe(true);
    });
    test('refresh Promise is resolved with {currentData,instance} parameter after onInit event', () => {
        expect.assertions(4);
        renderApp();
        return act(() => {
            return instance.refresh().then(result => {
                expect(result.currentData).toEqual(instance.getCopyData());
                expect(result.instance).toBe(instance);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
                expect(op.onChange.mock.calls.length === 0).toBe(true);
            });
        });
    });
});
describe('ready function : ', () => {
    // test('ready function and instance parameters always refer to same reference after re-rendering multiple times', () => {
    // });
    test('can not set onLoad event inside the ready function', () => {
        expect.assertions(4);
        const onLoad = jest.fn(() => { });
        const onInit = jest.fn(() => { });
        renderApp();
        return act(() => {
            ready(instance => {
                instance.one('onLoad', onLoad).one('onInit', onInit);
            });
            return instance.refresh().then(result => {
                expect(op.onLoad.mock.calls.length === 1).toBe(true);
                expect(op.onInit.mock.calls.length === 2).toBe(true);
                expect(onInit.mock.calls.length === 1).toBe(true);
                expect(onLoad.mock.calls.length === 0).toBe(true);
            });
        });
    });
    test('it calls its function parameter after onLoad event and first execution of onInit event', () => {
        expect.assertions(6);
        const onReady = jest.fn(() => { });
        renderApp();
        ready(onReady);
        expect(op.onLoad.mock.calls.length === 1).toBe(true);
        expect(op.onInit.mock.calls.length === 1).toBe(true);
        expect(onReady.mock.calls.length === 1).toBe(true);
        expect(op.onLoad).toHaveBeenCalledBefore(op.onInit);
        expect(op.onInit).toHaveBeenCalledBefore(onReady);
        expect(op.onChange.mock.calls.length).toBe(0);
    });
});
describe('onLoad, onInit and onChange events : ', () => {
    test('onLoad and then onInit are called initially but onChange is not called', () => {
        renderApp();
        expect(op.onLoad.mock.calls.length).toBe(1);
        expect(op.onInit.mock.calls.length).toBe(1);
        expect(op.onChange.mock.calls.length).toBe(0);
        expect(op.onLoad).toHaveBeenCalledBefore(op.onInit);
    });
    test('onChange is called with {currentData,perviousData} object as a parameter', () => {
        renderApp();
        act(() => { instance.select('2'); });
        expect(op.onChange.mock.calls.length).toBe(1);
        expect(op.onChange.mock.calls[0][0].currentData).toEqual(instance.getCopyData());
        expect(op.onChange.mock.calls[0][0].perviousData).toEqual(instance.getCopyPerviousData());
    });
});