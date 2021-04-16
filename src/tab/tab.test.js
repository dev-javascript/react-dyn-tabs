import React, { useState } from "react"
import { render, unmountComponentAtNode } from "react-dom";
import Tab from "./tab";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import DefaultTabInner from './defaulTabInner.js';
let container = document.createElement("div"), realUseContext;
const getDefaultApi = () => ({
    getTab: jest.fn((id) => ({
        title: "",
        tooltip: "",
        panelComponent: null,
        closable: true,
        iconClass: "",
        disable: false,
        id: 1
    })),
    eventHandlerFactory: jest.fn(({ e, id }) => { }),
    getOption: jest.fn(opName => DefaultTabInner),
    userProxy: {},
    optionsManager: {
        options: {
            accessibility: true, direction: 'ltr'
        },
        setting: {
            tabClass: 'rc-dyn-tabs-tab',
            titleClass: 'rc-dyn-tabs-title',
            iconClass: 'rc-dyn-tabs-icon',
            selectedClass: 'rc-dyn-tabs-selected',
            closeClass: 'rc-dyn-tabs-close',
            disableClass: 'rc-dyn-tabs-disable',
            panelIdTemplate: jest.fn(id => `rc-dyn-tabs-p-${id}`),
            ariaLabelledbyIdTemplate: jest.fn(id => `rc-dyn-tabs-l-${id}`)
        }
    }
})
    , setMockUseContext = (api) => {
        React.useContext = jest.fn(() => Object.assign({}, getDefaultApi(), api || {}));
    };
beforeAll(() => {
    document.body.appendChild(container);
    realUseContext = React.useContext;
});
beforeEach(() => {
    setMockUseContext();
});
afterEach(() => {
    unmountComponentAtNode(container);
    container.innerHTML = "";
    React.useContext = realUseContext;
});
afterAll(() => {
    document.body.removeChild(container);
    container = null;
});
describe('tab structure with default options : ', () => {
    test('default tab data', () => {
        setMockUseContext();
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('none closable tab', () => {
        setMockUseContext({
            getTab: jest.fn((id) => ({
                title: "",
                tooltip: "",
                panelComponent: null,
                closable: false,
                iconClass: "",
                disable: false,
                id: 1
            }))
        });
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('disabled tab', () => {
        setMockUseContext({
            getTab: jest.fn((id) => ({
                title: "",
                tooltip: "",
                panelComponent: null,
                closable: true,
                iconClass: "",
                disable: true,
                id: 1
            }))
        });
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('tab with provided tooltip and iconClass', () => {
        setMockUseContext({
            getTab: jest.fn((id) => ({
                title: "tab title",
                tooltip: "tab tooltip",
                panelComponent: null,
                closable: true,
                iconClass: "ui-icon ui-icon-heart",
                disable: false,
                id: 1
            }))
        });
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
describe('tab structure with rtl and none accessibility options : ', () => {
    test('default tab data', () => {
        setMockUseContext({
            optionsManager: {
                options: {
                    accessibility: false, direction: 'rtl'
                },
                setting: {
                    tabClass: 'rc-dyn-tabs-tab',
                    titleClass: 'rc-dyn-tabs-title',
                    iconClass: 'rc-dyn-tabs-icon',
                    selectedClass: 'rc-dyn-tabs-selected',
                    closeClass: 'rc-dyn-tabs-close',
                    disableClass: 'rc-dyn-tabs-disable',
                    panelIdTemplate: jest.fn(id => `rc-dyn-tabs-p-${id}`),
                    ariaLabelledbyIdTemplate: jest.fn(id => `rc-dyn-tabs-l-${id}`)
                }
            }
        });
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('none closable tab', () => {
        setMockUseContext({
            optionsManager: {
                options: {
                    accessibility: false, direction: 'rtl'
                },
                setting: {
                    tabClass: 'rc-dyn-tabs-tab',
                    titleClass: 'rc-dyn-tabs-title',
                    iconClass: 'rc-dyn-tabs-icon',
                    selectedClass: 'rc-dyn-tabs-selected',
                    closeClass: 'rc-dyn-tabs-close',
                    disableClass: 'rc-dyn-tabs-disable',
                    panelIdTemplate: jest.fn(id => `rc-dyn-tabs-p-${id}`),
                    ariaLabelledbyIdTemplate: jest.fn(id => `rc-dyn-tabs-l-${id}`)
                }
            },
            getTab: jest.fn((id) => ({
                title: "",
                tooltip: "",
                panelComponent: null,
                closable: false,
                iconClass: "",
                disable: false,
                id: 1
            }))
        });
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('disabled tab', () => {
        setMockUseContext({
            optionsManager: {
                options: {
                    accessibility: false, direction: 'rtl'
                },
                setting: {
                    tabClass: 'rc-dyn-tabs-tab',
                    titleClass: 'rc-dyn-tabs-title',
                    iconClass: 'rc-dyn-tabs-icon',
                    selectedClass: 'rc-dyn-tabs-selected',
                    closeClass: 'rc-dyn-tabs-close',
                    disableClass: 'rc-dyn-tabs-disable',
                    panelIdTemplate: jest.fn(id => `rc-dyn-tabs-p-${id}`),
                    ariaLabelledbyIdTemplate: jest.fn(id => `rc-dyn-tabs-l-${id}`)
                }
            },
            getTab: jest.fn((id) => ({
                title: "",
                tooltip: "",
                panelComponent: null,
                closable: true,
                iconClass: "",
                disable: true,
                id: 1
            }))
        });
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('tab with provided tooltip and iconClass', () => {
        setMockUseContext({
            optionsManager: {
                options: {
                    accessibility: false, direction: 'rtl'
                },
                setting: {
                    tabClass: 'rc-dyn-tabs-tab',
                    titleClass: 'rc-dyn-tabs-title',
                    iconClass: 'rc-dyn-tabs-icon',
                    selectedClass: 'rc-dyn-tabs-selected',
                    closeClass: 'rc-dyn-tabs-close',
                    disableClass: 'rc-dyn-tabs-disable',
                    panelIdTemplate: jest.fn(id => `rc-dyn-tabs-p-${id}`),
                    ariaLabelledbyIdTemplate: jest.fn(id => `rc-dyn-tabs-l-${id}`)
                }
            },
            getTab: jest.fn((id) => ({
                title: "tab title",
                tooltip: "tab tooltip",
                panelComponent: null,
                closable: true,
                iconClass: "ui-icon ui-icon-heart",
                disable: false,
                id: 1
            }))
        });
        const tree = renderer
            .create(<div>
                <Tab id="1" selectedTabID="1"></Tab>
                <Tab id="2" selectedTabID="1"></Tab>
            </div>)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


