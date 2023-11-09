/* eslint-disable react/prop-types */
import React, {createContext} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import useDynTabs from '../../index.js';
import ShowMoreTabs from './show-more-tabs/show-more-tabs.js';
//import MoreButtonPlugin from './index.js';
import {act} from 'react-dom/test-utils';
let container = document.createElement('div'),
  container2 = document.createElement('div');
let App,
  instance,
  ready,
  renderApp,
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
    ],
    selectedTabID: '1',
  }; //options
beforeAll(() => {
  document.body.appendChild(container);
  document.body.appendChild(container2);
});
beforeEach(() => {
  App = function App({options, plugins}) {
    const _options = Object.assign({}, op, options);
    if (_options.tabs) {
      const _tabs = [];
      _options.tabs.forEach((tab) => {
        _tabs.push({...tab});
      });
      _options.tabs = _tabs;
    }
    const [Tablist, Panellist, readyFunction] = useDynTabs(_options, plugins);
    ready = readyFunction;
    readyFunction((instanceParam) => {
      instance = instanceParam;
    });
    return (
      <div>
        <Tablist></Tablist>
        <Panellist></Panellist>
      </div>
    );
  };
  renderApp = (options = {}, plugins = []) => {
    act(() => {
      render(<App options={options} plugins={plugins}></App>, container);
    });
  };
});
afterEach(() => {
  App = null;
  instance = null;
  op = null;
  ready = null;
  renderApp = null;
  unmountComponentAtNode(container);
  unmountComponentAtNode(container2);
  container.innerHTML = '';
  container2.innerHTML = '';
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
  document.body.removeChild(container2);
  container2 = null;
});
describe('plugin constructor : ', () => {
  test('should be called with certain parameters', () => {
    expect.assertions(6);
    const _plug = jest.fn(() => {});
    renderApp({}, [_plug]);
    return act(() => {
      expect(_plug.mock.calls.length).toBe(1);
      expect(_plug.mock.calls[0].length).toBe(3);
      expect(_plug.mock.calls[0][0].userProxy).toEqual(instance);
      expect(_plug.mock.calls[0][2].render.name).toBe('TabsComponent');
      expect(_plug.mock.calls[0][1].hasOwnProperty('ForceUpdateContext')).toBe(true);
      expect(_plug.mock.calls[0][1].hasOwnProperty('StateContext')).toBe(true);
    });
  });
});
describe('bbb', () => {
  const getPlugins = (insProp = {}) => {
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
  test('resize method should be called when closing a tab.', () => {
    const resize = jest.fn(() => {});
    instance = null;
    renderApp(
      {
        onLoad: function () {
          return act(() => {
            this.close('1');
          });
        },
      },
      getPlugins({resize}),
    );

    expect(resize.mock.calls.length).toBe(2);
  });
});
describe('aaaa', () => {
  const getPlugins = (insProp = {}) => {
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

  //   expect.assertions(1);
  //   const resize = jest.fn(() => {});
  //   renderApp({}, getPlugins({resize}));
  //   act(() => {
  //     return instance.sort(['2', '1']).then(() => {
  //       return expect(resize.mock.calls.length).toBe(2);
  //     });
  //   });
  // });

  test('resize method should be called when opening a new tab.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      {
        onLoad: function () {
          this.open({id: '3'});
        },
      },
      getPlugins({resize}),
    );
    expect(resize.mock.calls.length).toBe(2);
  });
});
describe('plugins methods : ', () => {
  const getPlugins = (insProp = {}) => {
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
  it('resize method should be called at mount.', () => {
    const resize = jest.fn(() => {});
    renderApp({}, getPlugins({resize}));
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
      getPlugins({resize}),
    );
    expect(resize.mock.calls.length).toBe(1);
  });
  test('resize method should be called when switching tabs.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      {
        onLoad: function () {
          this.refresh();
        },
      },
      getPlugins({resize}),
    );
    act(() => {
      return instance.select('2').then(() => {
        return expect(resize.mock.calls.length).toBe(2);
      });
    });
  });
  // test('resize method should be called when sorting tabs.', () => {
});
