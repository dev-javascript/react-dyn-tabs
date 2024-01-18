/* eslint react/prop-types: 0 */
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import TabList from '../tabList/tabList';
import PanelList from '../panelList/panelList.js';
import reducer from '../utils/stateManagement/reducer';
import Api from '../utils/api';
import {ApiContext, StateContext, ForceUpdateContext} from '../context.js';
import useDynTabs from './useDynamicTabs.js';
import Components from '../components/index.js';
let container = document.createElement('div');
let op = ''; //options
let renderApp;
beforeAll(() => {
  document.body.appendChild(container);
});
beforeEach(() => {
  op = {
    tabs: [
      {
        id: '1',
        title: 'mock tab 1',
        closable: true,
        panelComponent: <p>tab1 content</p>,
      },
      {
        id: '2',
        title: 'mock tab 2',
        iconClass: 'ui-icon ui-icon-seek-end',
        closable: false,
        panelComponent: <p>tab2 content</p>,
      },
      {
        id: '3',
        title: 'mock tab 3',
        iconClass: 'ui-icon ui-icon-seek-end',
        closable: false,
        panelComponent: <p>tab3 content</p>,
      },
    ],
    selectedTabID: '1',
    accessibility: true,
    onSelect: jest.fn(function () {}),
    onChange: jest.fn(function () {}),
    onInit: jest.fn(function () {}),
    onClose: jest.fn(function () {}),
    onOpen: jest.fn(function () {}),
    onLoad: jest.fn(function () {}),
    beforeClose: jest.fn(function () {}),
    beforeSelect: jest.fn(function () {}),
  };
  renderApp = (getDeps, rerender) => {
    const App = function () {
      const getDepsWrapper = () => {
        return Object.assign({}, {Components}, getDeps());
      };
      const [Tablist, Panellist] = useDynTabs(getDepsWrapper, op);
      return (
        <div>
          <Tablist></Tablist>
          <Panellist></Panellist>
        </div>
      );
    };
    act(() => {
      render(<App></App>, container);
    });
    rerender &&
      act(() => {
        render(<App></App>, container);
      });
  };
});
afterEach(() => {
  unmountComponentAtNode(container);
  container.innerHTML = '';
  renderApp = null;
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
});
describe('counting tabs renders : ', () => {
  test('each tab should be rendered once initially', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
      const updateStateRef = api.updateStateRef;
      api.updateStateRef = jest.fn(function () {
        updateStateRef.apply(api, arguments);
        return api;
      });
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(3);
    expect(_api.updateStateRef.mock.calls.length).toBe(1);
  });
  test('tabs should not be rendered when parent component is re-rendered', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
      const updateStateRef = api.updateStateRef;
      api.updateStateRef = jest.fn(function () {
        updateStateRef.apply(api, arguments);
        return api;
      });
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps, true);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(3);
    expect(_api.updateStateRef.mock.calls.length).toBe(2);
  });
  test('only current selected and previously selected tabs should be rendered after switching', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.select('2');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(2);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[0][0]).toBe('1');
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[1][0]).toBe('2');
  });
  test('tabs should not be rendered after selecting a tab twice', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.select('1');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(0);
  });
  test('only opened tab should be rendered after opening a new tab', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        TabList,
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.open({id: '4', title: 'tab4'});
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(1);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[0][0]).toBe('4');
  });
  test('tabs should not be rendered after closing a none selected tab', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.close('3');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(0);
  });
  test('only new selected tab should be rendered after closing a selected tab with switching', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.close('1');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(1);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[0][0]).toBe('2');
  });
  test('all tabs should be render after calling refresh method', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, PanelList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.refresh();
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(3);
  });
});
describe('counting panels renders : ', () => {
  test('each panel should be rendered once initially', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
      const updateStateRef = api.updateStateRef;
      api.updateStateRef = jest.fn(function () {
        updateStateRef.apply(api, arguments);
        return api;
      });
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(3);
    expect(_api.updateStateRef.mock.calls.length).toBe(1);
  });
  test('panels should not be rendered when parent component is re-rendered', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
      const updateStateRef = api.updateStateRef;
      api.updateStateRef = jest.fn(function () {
        updateStateRef.apply(api, arguments);
        return api;
      });
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps, true);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(3);
    expect(_api.updateStateRef.mock.calls.length).toBe(2);
  });
  test('only current selected and previously selected panels should be rendered after switching', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.select('2');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(2);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[0][0]).toBe('1');
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[1][0]).toBe('2');
  });
  test('panels should not be rendered after selecting a tab twice', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.select('1');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(0);
  });
  test('only panle of opened tab should be rendered after opening a new tab', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.open({id: '4', title: 'tab4'});
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(1);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[0][0]).toBe('4');
  });
  test('panels should not be rendered after closing a none selected tab', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.close('3');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(0);
  });
  test('only panel of new selected tab should be rendered after closing a selected tab with switching', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.close('1');
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(1);
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls[0][0]).toBe('2');
  });
  test('all panels should be render after calling refresh method', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function () {
      return {
        reducer,
        getApiInstance,
        Components: {...Components, TabList: () => null},
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    renderApp(getDeps);
    _api.optionsManager.setting.panelIdTemplate = jest.fn((id) => id);
    act(() => {
      _api.refresh();
    });
    expect(_api.optionsManager.setting.panelIdTemplate.mock.calls.length).toBe(3);
  });
});
describe('output : ', () => {
  test('it returns TabList, PanelList and ready function with a same referenc after rendering multiple times', () => {
    let _api;
    const getApiInstance = function (op) {
      const api = new Api({options: op});
      _api = api;
      return api;
    };
    const getDeps = function getDeps() {
      return {
        Components,
        reducer,
        getApiInstance,
        PanelList,
        TablistView: function TablistView(props) {
          return <>{props.children}</>;
        },
        TablistContainer: function TablistContainer(props) {
          return <>{props.children}</>;
        },
        TabList,
        ApiContext,
        StateContext,
        ForceUpdateContext,
      };
    };
    let counter = 0,
      firstReady,
      secondReady,
      firstTabList,
      secondTabList,
      firstPanelList,
      secondPanelList;
    const App = function () {
      const [TabList, PanelList, ready] = useDynTabs(getDeps, op);
      if (counter === 0) {
        firstPanelList = PanelList;
        firstReady = ready;
        firstTabList = TabList;
      } else {
        secondPanelList = PanelList;
        secondReady = ready;
        secondTabList = TabList;
      }
      counter++;
      return (
        <div>
          <TabList></TabList>
          <PanelList></PanelList>
        </div>
      );
    };
    act(() => {
      render(<App></App>, container);
    });
    act(() => {
      _api.refresh();
    });
    expect(firstTabList).toBe(secondTabList);
    expect(firstReady).toBe(secondReady);
    expect(firstPanelList).toBe(secondPanelList);
  });
});
