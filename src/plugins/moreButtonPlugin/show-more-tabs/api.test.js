/* eslint-disable react/prop-types */
import React, {useEffect} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import useDynTabs from '../../../index.js';
import ElManagement from '../elementManagement/index.js';
import {act} from 'react-dom/test-utils';
import Api from './api';
let container = document.createElement('div');
let setHiddenTabIDs, api, renderApp, instance;
beforeAll(() => {
  document.body.appendChild(container);
});
beforeEach(() => {
  setHiddenTabIDs = jest.fn(() => {});
  renderApp = (apiProps = {}) => {
    const App = function App() {
      const [Tablist, Panellist, readyFunction] = useDynTabs({});
      useEffect(() => {
        readyFunction((ins) => {
          instance = ins;
          instance.tablistRef = {
            current: {
              style: {overflow: {}},
              parentElement: {parentElement: {style: {overflow: {}}, parentElement: {}}},
            },
          };
        });
      }, []);
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
    api = new Api(
      Object.assign(
        {},
        {
          setHiddenTabIDs,
          btnRef: React.createRef(),
          getElManagementIns: (param) => new ElManagement(param),
          ctx: instance,
        },
        apiProps,
      ),
    );
  };
});
afterEach(() => {
  api = null;
  setHiddenTabIDs = null;
  renderApp = null;
  instance = null;
  unmountComponentAtNode(container);
  container.innerHTML = '';
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
});
describe('installResizer method : ', () => {
  test('it should call resizeDetectorIns.debncListenTo', () => {
    renderApp();
    const resizeDetectorIns = {debncListenTo: jest.fn((el, callback) => callback())};
    expect(resizeDetectorIns.debncListenTo.mock.calls.length).toBe(0);
    api.raf = jest.fn(() => {});
    expect(api.raf.mock.calls.length).toBe(0);
    api.installResizer(resizeDetectorIns);
    expect(resizeDetectorIns.debncListenTo.mock.calls.length).toBe(1);
    expect(resizeDetectorIns.debncListenTo.mock.calls[0][0]).toEqual(api.tablistViewEl);
    expect(typeof resizeDetectorIns.debncListenTo.mock.calls[0][1]).toBe('function');
    expect(api.raf.mock.calls.length).toBe(1);
  });
  test('it should set tablistEl, tablistContainerEl, tablistViewEl properties', () => {
    renderApp();
    expect(!!api.tablistEl).toBe(false);
    expect(!!api.tablistContainerEl).toBe(false);
    expect(!!api.tablistViewEl).toBe(false);
    api.installResizer({debncListenTo: () => {}});
    expect(!!api.tablistEl).toBe(true);
    expect(!!api.tablistContainerEl).toBe(true);
    expect(!!api.tablistViewEl).toBe(true);
  });
  test('it should set overflow of tablistEl element, visible', () => {
    renderApp();
    expect(api.tablistEl?.style?.overflow == 'visible').toBe(false);
    api.installResizer({debncListenTo: () => {}});
    expect(api.tablistEl?.style?.overflow == 'visible').toBe(true);
  });
  test('it should set overflow of tablistContainerEl element, hidden', () => {
    renderApp();
    expect(api.tablistContainerEl?.style?.overflow == 'hidden').toBe(false);
    api.installResizer({debncListenTo: () => {}});
    expect(api.tablistContainerEl?.style?.overflow == 'hidden').toBe(true);
  });
});
describe('uninstallResizer method : ', () => {
  test('it should call resizeDetectorIns.uninstall', () => {
    renderApp();
    const resizeDetectorIns = {debncListenTo: () => {}, uninstall: jest.fn(() => {})};
    api.installResizer(resizeDetectorIns);
    expect(resizeDetectorIns.uninstall.mock.calls.length).toBe(0);
    if (api.tablistViewEl && resizeDetectorIns) {
      api.uninstallResizer(resizeDetectorIns);
    }
    expect(resizeDetectorIns.uninstall.mock.calls.length).toBe(1);
    expect(resizeDetectorIns.uninstall.mock.calls[0][0]).toEqual(api.tablistViewEl);
  });
});
