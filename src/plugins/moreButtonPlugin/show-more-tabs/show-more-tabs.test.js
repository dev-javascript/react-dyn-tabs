/* eslint-disable react/prop-types */
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import ShowMoreTabsComponent from './show-more-tabs.js';
import components from '../../../components/index.js';
import {act} from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import Api from './api.js';
import ElManagement from '../elementManagement/index.js';
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
 * @param {Object} ins - ref.current
 * @param {Object} deps - { resizeDetectorIns, getInstance:(ctx, setHiddenTabIDs) => ins }
 */
let renderApp;
beforeAll(() => {
  document.body.appendChild(container);
});
beforeEach(() => {
  renderApp = (snapshot, props = {}, api = {}, deps = {}) => {
    props.ins = props.ins || {};
    const getInstance =
      deps.getInstance ||
      function (ctx, setHiddenTabIDs) {
        return Object.assign(
          new Api({
            setHiddenTabIDs,
            btnRef: React.createRef(),
            getElManagementIns: (param) => new ElManagement(param),
            ctx,
          }),
          api,
        );
      };
    const resizeDetectorIns = deps.resizeDetectorIns || {};
    const ShowMoreButton = ShowMoreTabsComponent.bind(undefined, () => ({getInstance, resizeDetectorIns}));
    if (snapshot) {
      return <ShowMoreButton {...props}></ShowMoreButton>;
    }
    return act(() => {
      render(<ShowMoreButton {...props}></ShowMoreButton>, container);
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
        setEls: () => {},
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
        setEls: () => {},
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
  test('default button component should be rendered when moreButtonPlugin_buttonComponent option is not provided', () => {
    renderApp({});
    expect(document.getElementById('built-in-button') != null).toBe(true);
  });
  test('user button component should be rendered when moreButtonPlugin_buttonComponent option is provided', () => {
    renderApp({moreButtonPlugin_buttonComponent: () => <button id="user-button" />});
    expect(document.getElementById('built-in-button') != null).toBe(false);
    expect(document.getElementById('user-button') != null).toBe(true);
  });
  test('moreButtonPlugin_buttonComponent option should be a function component and not a React element', () => {
    renderApp({moreButtonPlugin_buttonComponent: () => <button id="user-button" />});
    expect(document.getElementById('user-button') != null).toBe(true);
    renderApp({moreButtonPlugin_buttonComponent: <button id="user-button-element" />});
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
