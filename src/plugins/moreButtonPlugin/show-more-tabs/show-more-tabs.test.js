/* eslint-disable react/prop-types */
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import ShowMoreTabsComponent from './show-more-tabs.js';
import {act} from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import Api from './api.js';
import tabsMoreButton from 'tabs-more-button';
import Ctx from '../../../utils/api/index.js';
let container = document.createElement('div');
const moreButtonPlugin_buttonComponent = (props) => <div {...props}>{props.children}</div>;
const ctx = new Ctx({
  options: {
    moreButtonPlugin_buttonComponent,
    selectedTabID: '1',
    tabs: [
      {id: '1', title: 'tab1', panelComponent: <p>tab content 1</p>},
      {id: '2', title: 'tab2', panelComponent: <p>tab content 2</p>},
    ],
  },
});
/**
 * render the app
 * @param {boolean} snapshot - if true then returns the element
 * @param {Object} props - {ctx,openTabIDs,selectedTabID}
 * @param {Object} insProperties - ref.current
 * @param {Object} deps - { resizeDetectorIns, getInstance:(ctx, setHiddenTabIDs) => ins }
 * @param {Object} props2 - {ctx,openTabIDs,selectedTabID}
 */
let renderApp;
beforeAll(() => {
  document.body.appendChild(container);
});
beforeEach(() => {
  renderApp = (snapshot, props, insProperties = {}, deps = {}, props2) => {
    props = props || {
      ctx,
      openTabIDs: ['1', '2'],
      selectedTabID: '1',
    };
    const getInstance =
      deps.getInstance ||
      function (ctx, setHiddenTabIDs) {
        return Object.assign(
          new Api({
            setHiddenTabIDs,
            btnRef: React.createRef(),
            getResizerIns: function (options) {
              return new (Function.prototype.bind.apply(tabsMoreButton))(options);
            },
            ctx,
          }),
          insProperties,
        );
      };
    const resizeDetectorIns = deps.resizeDetectorIns || {};
    const ShowMoreButton = ShowMoreTabsComponent.bind(undefined, () => ({getInstance, resizeDetectorIns}));
    if (snapshot) {
      return <ShowMoreButton {...props}></ShowMoreButton>;
    }
    return act(() => {
      render(<ShowMoreButton {...props}></ShowMoreButton>, container);
      props2 && render(<ShowMoreButton {...props2}></ShowMoreButton>, container);
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
describe('BUTTON CONTAINER STRUCTURE : ', () => {
  test('default button', () => {
    const com = renderApp(
      true,
      {openTabIDs: ['1', '2'], selectedTabID: '1', ctx},
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize: () => {},
      },
    );
    const tree = renderer.create(com).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('resize method should be called when tabs are changed : ', () => {
  test('resize method should be called at mount.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      false,
      {openTabIDs: ['1', '2'], selectedTabID: '1', ctx},
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize,
      },
    );
    expect(resize.mock.calls.length).toBe(1);
  });
  test('resize method should not be called when refreshing tabs.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize,
      },
      undefined,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
    );
    expect(resize.mock.calls.length).toBe(1);
  });
  test('resize method should be called when switching tabs.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize,
      },
      undefined,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '2',
        ctx,
      },
    );
    expect(resize.mock.calls.length).toBe(2);
  });
  test('resize method should be called when opening a new tab.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize,
      },
      undefined,
      {
        openTabIDs: ['1', '2', '3'],
        selectedTabID: '1',
        ctx,
      },
    );
    expect(resize.mock.calls.length).toBe(2);
  });
  test('resize method should be called when closing a tab.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize,
      },
      undefined,
      {
        openTabIDs: ['1'],
        selectedTabID: '1',
        ctx,
      },
    );
    expect(resize.mock.calls.length).toBe(2);
  });
  test('resize method should be called when sorting tabs.', () => {
    const resize = jest.fn(() => {});
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize,
      },
      undefined,
      {
        openTabIDs: ['2', '1'],
        selectedTabID: '1',
        ctx,
      },
    );
    expect(resize.mock.calls.length).toBe(2);
  });
});
describe('resize detector should be called correctly : ', () => {
  test('installResizer and uninstallResizer methods should be called at mount.', () => {
    const installResizer = jest.fn(() => {});
    const uninstallResizer = jest.fn(() => {});
    renderApp(false, undefined, {
      setResizer: () => {},
      installResizer,
      uninstallResizer,
      resize: () => {},
    });
    expect(installResizer.mock.calls.length).toBe(1);
    act(() => {
      unmountComponentAtNode(container);
    });
    expect(uninstallResizer.mock.calls.length).toBe(1);
  });
});
describe('button component : ', () => {
  test('button component should render moreButtonPlugin_buttonComponent option as a button', () => {
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize: () => {},
      },
    );
    expect(document.getElementById('user-more-button') == null).toBe(true);
    const moreButtonPlugin_buttonComponent = ctx.getOption('moreButtonPlugin_buttonComponent');
    ctx.setOption('moreButtonPlugin_buttonComponent', (props) => (
      <div {...props} id="user-more-button">
        {props.children}
      </div>
    ));
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer: () => {},
        installResizer: () => {},
        uninstallResizer: () => {},
        resize: () => {},
      },
    );
    expect(document.getElementById('user-more-button') == null).toBe(false);
    ctx.setOption('moreButtonPlugin_buttonComponent', moreButtonPlugin_buttonComponent);
  });
  test('moreButtonPlugin_buttonComponent option should be a function component and not a React element', () => {
    const moreButtonPlugin_buttonComponent = ctx.getOption('moreButtonPlugin_buttonComponent');
    ctx.setOption('moreButtonPlugin_buttonComponent', <div id="user-more-button"></div>);
    try {
      renderApp(
        false,
        {
          openTabIDs: ['1', '2'],
          selectedTabID: '1',
          ctx,
        },
        {
          setResizer: () => {},
          installResizer: () => {},
          uninstallResizer: () => {},
          resize: () => {},
        },
      );
    } catch (e) {
      expect(document.getElementById('user-more-button') == null).toBe(true);
    }
    ctx.setOption('moreButtonPlugin_buttonComponent', moreButtonPlugin_buttonComponent);
  });
});
describe('mounting : ', () => {
  test('at first the setResizer method should be called then installResizer and then resize method', () => {
    const installResizer = jest.fn(() => {});
    const resize = jest.fn(() => {});
    const setResizer = jest.fn(() => {});
    renderApp(
      false,
      {
        openTabIDs: ['1', '2'],
        selectedTabID: '1',
        ctx,
      },
      {
        setResizer,
        installResizer,
        uninstallResizer: () => {},
        resize,
      },
    );
    expect(setResizer).toHaveBeenCalledBefore(installResizer);
    expect(installResizer).toHaveBeenCalledBefore(resize);
    expect(resize.mock.calls.length).toBe(1);
  });
});
