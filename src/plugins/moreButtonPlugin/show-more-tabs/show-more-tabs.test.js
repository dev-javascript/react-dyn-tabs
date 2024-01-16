/* eslint-disable react/prop-types */
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import useDynTabs from '../../../index.js';
import ShowMoreTabs from './show-more-tabs.js';
//import MoreButtonPlugin from './index.js';
import {act} from 'react-dom/test-utils';
let container = document.createElement('div');
let renderApp;
let op = {
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
  ],
  selectedTabID: '1',
}; //options
beforeAll(() => {
  document.body.appendChild(container);
});
beforeEach(() => {
  renderApp = (options = {}, plugins, callback = () => {}, resizeInsProps = {}) => {
    const App = function App({options, plugins}) {
      const _options = Object.assign({}, op, options);
      if (_options.tabs) {
        const _tabs = [];
        _options.tabs.forEach((tab) => {
          _tabs.push({...tab});
        });
        _options.tabs = _tabs;
      }
      const [Tablist, Panellist, readyFunction] = useDynTabs(_options, plugins);
      callback(readyFunction);
      return (
        <div>
          <Tablist></Tablist>
          <Panellist></Panellist>
        </div>
      );
    };
    const getPlugins = (insProp) => {
      const deps = {
        getInstance: () => ({
          installResizer: jest.fn(() => {}),
          uninstallResizer: jest.fn(() => {}),
          setEls: () => {},
          btnRef: React.createRef(),
          resize: jest.fn(() => {}),
          btnContainerPropsGenerator: () => ({}),
          btnPropsGenerator: () => ({}),
          ...insProp,
        }),
        resizeDetectorIns: jest.fn(() => {}),
        Button: () => <button id="built-in-button" />,
      };
      const ShowMoreTabsMock = ShowMoreTabs.bind(undefined, () => deps);
      return [
        function (ctx, contexts, TabsComponent) {
          const {
            setting: {tablistOverflowClass},
            internalOptions,
          } = ctx.optionsManager;
          internalOptions.TablistOverflow = (props) => <div>{props.children}</div>;
          internalOptions.ShowMoreButton = (props) => (
            <ShowMoreTabsMock {...props} ctx={ctx} contexts={contexts} TabsComponent={TabsComponent}>
              {props.children}
            </ShowMoreTabsMock>
          );
        },
      ];
    };
    plugins = plugins || getPlugins(resizeInsProps);
    return act(() => {
      render(<App options={options} plugins={plugins}></App>, container);
    });
  };
});
afterEach(() => {
  renderApp = null;
  unmountComponentAtNode(container);
  container.innerHTML = '';
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
});
describe('plugin constructor : ', () => {
  test('should be called with certain parameters', () => {
    expect.assertions(6);
    const _plug = jest.fn(() => {});
    let instance;
    renderApp({}, [_plug], (ins) => {
      instance = ins;
    });
    return act(() => {
      expect(_plug.mock.calls.length).toBe(1);
      expect(_plug.mock.calls[0].length).toBe(3);
      expect(Object.keys(_plug.mock.calls[0][0].userProxy).sort()).toEqual(Object.keys(instance).sort());
      expect(Object.keys(_plug.mock.calls[0][2]).toString()).toBe(
        `TablistContainer,TablistContainerFactory,TablistView,TablistViewFactory,PanelList,TabList,TabListFactory,Tabs,TabsFactory,Tab,TabFactory,memomizeTab`,
      );
      expect(_plug.mock.calls[0][1].hasOwnProperty('ForceUpdateContext')).toBe(true);
      expect(_plug.mock.calls[0][1].hasOwnProperty('StateContext')).toBe(true);
    });
  });
});
describe('resize method should be called when tabs are changed : ', () => {
  test('resize method should be called at mount.', () => {
    const resize = jest.fn(() => {});
    renderApp({}, undefined, undefined, {resize});
    expect(resize.mock.calls.length).toBe(1);
  });
  test('resize method should not be called when refreshing tabs.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      {
        onLoad: function () {
          this.refresh();
        },
      },
      undefined,
      undefined,
      {resize},
    );
    expect(resize.mock.calls.length).toBe(1);
  });
  test('resize method should be called when switching tabs.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      {
        onLoad: function () {
          this.select('2');
        },
      },
      undefined,
      undefined,
      {resize},
    );
    expect(resize.mock.calls.length).toBe(2);
  });
  test('resize method should be called when opening a new tab.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      {
        onLoad: function () {
          this.open({id: '3'});
        },
      },
      undefined,
      undefined,
      {resize},
    );
    expect(resize.mock.calls.length).toBe(2);
  });
  test('resize method should be called when closing a tab.', () => {
    const resize = jest.fn(() => {});
    let ready;
    renderApp(
      {},
      undefined,
      (_ready) => {
        ready = _ready;
      },
      {resize},
    );
    act(() => {
      let ins;
      ready((_ins) => {
        ins = _ins;
      });
      ins.close('2', false);
    });
    expect(resize.mock.calls.length).toBe(2);
  });
  test('resize method should be called when sorting tabs.', () => {
    const resize = jest.fn(() => {});
    let ready;
    renderApp(
      {},
      undefined,
      (_ready) => {
        ready = _ready;
      },
      {resize},
    );
    act(() => {
      let ins;
      ready((_ins) => {
        ins = _ins;
      });
      ins.sort(['2', '1']);
    });
    expect(resize.mock.calls.length).toBe(2);
  });
});
describe('resize detector should be called correctly : ', () => {
  test('installResizer method should be called at mount.', () => {
    const installResizer = jest.fn(() => {});
    renderApp({}, undefined, undefined, {installResizer});
    expect(installResizer.mock.calls.length).toBe(1);
  });
  test('uninstallResizer method should be called at unmount.', () => {
    const uninstallResizer = jest.fn(() => {});
    renderApp({}, undefined, undefined, {uninstallResizer});
    expect(uninstallResizer.mock.calls.length).toBe(0);
    act(() => {
      unmountComponentAtNode(container);
    });
    expect(uninstallResizer.mock.calls.length).toBe(1);
  });
});
describe('button component : ', () => {
  test('default button component should be rendered when showMoreButtonComponent option is not provided', () => {
    renderApp({});
    expect(document.getElementById('built-in-button') != null).toBe(true);
  });
  test('user button component should be rendered when showMoreButtonComponent option is provided', () => {
    renderApp({showMoreButtonComponent: () => <button id="user-button" />});
    expect(document.getElementById('built-in-button') != null).toBe(false);
    expect(document.getElementById('user-button') != null).toBe(true);
  });
  test('showMoreButtonComponent option should be a function component and not a React element', () => {
    renderApp({showMoreButtonComponent: () => <button id="user-button" />});
    expect(document.getElementById('user-button') != null).toBe(true);
    renderApp({showMoreButtonComponent: <button id="user-button-element" />});
    expect(document.getElementById('user-button-element') != null).toBe(false);
    expect(document.getElementById('built-in-button') != null).toBe(true);
  });
});
describe('mounting : ', () => {
  test('at first the setEls method should be called then installResizer and then resize method', () => {
    const installResizer = jest.fn(() => {});
    const resize = jest.fn(() => {});
    const setEls = jest.fn(() => {});
    const api = {installResizer, resize, setEls};
    renderApp({}, null, (ins) => {}, api);
    expect(api.setEls).toHaveBeenCalledBefore(api.installResizer);
    expect(api.installResizer).toHaveBeenCalledBefore(api.resize);
    expect(api.resize.mock.calls.length).toBe(1);
  });
});
