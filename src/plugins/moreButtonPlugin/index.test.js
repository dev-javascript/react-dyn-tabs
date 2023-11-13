/* eslint-disable react/prop-types */
import React, {createContext} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import useDynTabs from '../../index.js';
import ShowMoreTabs from './show-more-tabs/show-more-tabs.js';
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
          btnRef: React.createRef(),
          resize: jest.fn(() => {}),
          ...insProp,
        }),
        resizeDetectorIns: jest.fn(() => {}),
        Button: () => null,
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
      expect(_plug.mock.calls[0][2].render.name).toBe('TabsComponent');
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
