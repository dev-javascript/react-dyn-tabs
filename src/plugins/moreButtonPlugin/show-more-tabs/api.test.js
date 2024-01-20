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
describe('setEls method : ', () => {
  test('it should set tablistEl, tablistContainerEl, tablistViewEl properties', () => {
    renderApp();
    expect(!!api.tablistEl).toBe(false);
    expect(!!api.tablistContainerEl).toBe(false);
    expect(!!api.tablistViewEl).toBe(false);
    api.setEls();
    expect(!!api.tablistEl).toBe(true);
    expect(!!api.tablistContainerEl).toBe(true);
    expect(!!api.tablistViewEl).toBe(true);
  });
  test('it should set overflow of tablistEl element, visible', () => {
    renderApp();
    expect(api.tablistEl?.style?.overflow == 'visible').toBe(false);
    api.setEls();
    expect(api.tablistEl?.style?.overflow == 'visible').toBe(true);
  });
  test('it should set overflow of tablistContainerEl element to hidden', () => {
    renderApp();
    expect(api.tablistContainerEl?.style?.overflow == 'hidden').toBe(false);
    api.setEls();
    expect(api.tablistContainerEl?.style?.overflow == 'hidden').toBe(true);
  });
});
describe('installResizer method : ', () => {
  test('it should call resizeDetectorIns.debncListenTo', () => {
    renderApp();
    const resizeDetectorIns = {debncListenTo: jest.fn(() => {})};
    api.installResizer(resizeDetectorIns);
    expect(resizeDetectorIns.debncListenTo.mock.calls.length).toBe(1);
  });
  test('it should assign resize detector on tablistViewEl in order to when this plugin hides a few tabs then the resize event should not be called again', () => {
    renderApp();
    const resizeDetectorIns = {debncListenTo: jest.fn(() => {})};
    api.installResizer(resizeDetectorIns);
    expect(resizeDetectorIns.debncListenTo.mock.calls[0][0]).toEqual(api.tablistViewEl);
    expect(typeof resizeDetectorIns.debncListenTo.mock.calls[0][1]).toBe('function');
  });
});
describe('uninstallResizer method : ', () => {
  test('it should call resizeDetectorIns.uninstall', () => {
    renderApp();
    const resizeDetectorIns = {debncListenTo: () => {}, uninstall: jest.fn(() => {})};
    api.setEls();
    expect(resizeDetectorIns.uninstall.mock.calls.length).toBe(0);
    if (api.tablistViewEl && resizeDetectorIns) {
      api.uninstallResizer(resizeDetectorIns);
    }
    expect(resizeDetectorIns.uninstall.mock.calls.length).toBe(1);
    expect(resizeDetectorIns.uninstall.mock.calls[0][0]).toEqual(api.tablistViewEl);
  });
});
describe('resize method : ', () => {
  const mockApi = (extendsObj = {}) =>
    Object.assign(
      api,
      {
        getElManagementIns: () => ({}),
        els: undefined,
        validateTabsCount: () => true,
        showAll: () => {},
        tabs: [],
        tabsCount: 1,
        checkOverflow: () => false,
        _setHiddenTabIDs: () => '1,2',
        findFirstHiddenTabIndexFactory: () => '1',
        getSelectedTabInfo: () => ({}),
        getSearchBoundries: () => [],
        getOrder: () => 'asc',
        validateSliderMinSize: () => false,
      },
      extendsObj,
    );
  test('it should call showAll method at frist if validateTabsCount method returns true, regardless of return value from checkOverflow method', () => {
    renderApp();
    api.showAll = jest.fn(() => {});
    api.validateTabsCount = jest.fn(() => true);
    api.checkOverflow = () => false;
    try {
      api.resize();
    } catch {}
    expect(api.validateTabsCount.mock.calls.length).toBe(1);
    expect(api.validateTabsCount.mock.calls[0][0]).toEqual(api.api.getData());
    expect(api.showAll.mock.calls.length).toBe(1);

    api.showAll = jest.fn(() => {});
    api.validateTabsCount = jest.fn(() => false);
    api.checkOverflow = () => false;
    try {
      api.resize();
    } catch {}
    expect(api.validateTabsCount.mock.calls.length).toBe(1);
    expect(api.showAll.mock.calls.length).toBe(0);
  });
  test('it should set els prop and then calls checkOverflow method', () => {
    expect.assertions(1);
    renderApp();
    mockApi({
      checkOverflow: () => {
        expect(api.els).toEqual({});
        return false;
      },
    });
    api.resize();
  });
  test('if checkOverflow method returns false then it should returns result of _setHiddenTabIDs method', () => {
    expect.assertions(1);
    renderApp();
    expect(api.resize()).toEqual(api._setHiddenTabIDs());
  });
  test('it should call hideTabs method if checkOverflow method returns true', () => {
    renderApp();
    let hideTabs = jest.fn(() => {});
    mockApi({hideTabs});
    api.resize();
    expect(hideTabs.mock.calls.length).toBe(0);

    hideTabs = jest.fn(() => {});
    mockApi({hideTabs, checkOverflow: () => true});
    api.resize();
    expect(hideTabs.mock.calls.length).toBe(1);
  });
  test('it should call hideTabs method based on returned value of validateSliderMinSize method', () => {
    renderApp();
    let hideTabs = jest.fn(() => {});
    mockApi({hideTabs, checkOverflow: () => true});
    api.validateSliderMinSize = () => false;
    api.resize();
    expect(hideTabs.mock.calls[0][0]).toBe(0);
    expect(hideTabs.mock.calls[0][1]).toEqual(api.getSelectedTabInfo());
    expect(hideTabs.mock.calls[0][2]).toBe(true);

    hideTabs = jest.fn(() => {});
    mockApi({hideTabs, checkOverflow: () => true});
    api.validateSliderMinSize = () => true;
    api.resize();
    expect(hideTabs.mock.calls[0][0]).toBe(api.findFirstHiddenTabIndexFactory());
    expect(hideTabs.mock.calls[0][1]).toEqual(api.getSelectedTabInfo());
    expect(hideTabs.mock.calls[0][2]).toBe(undefined);
  });
  test('the setHiddenTabIDs method should be called when either of validateTabsCount and checkOverflow return false', () => {
    renderApp();
    const hideTabs = jest.fn(() => {});

    mockApi({hideTabs, checkOverflow: () => true, validateTabsCount: () => true});
    api._setHiddenTabIDs = jest.fn(() => {});
    api.resize();
    expect(api._setHiddenTabIDs.mock.calls.length).toBe(0);

    mockApi({hideTabs, checkOverflow: () => false, validateTabsCount: () => true});
    api._setHiddenTabIDs = jest.fn(() => {});
    api.resize();
    expect(api._setHiddenTabIDs.mock.calls.length).toBe(1);

    mockApi({hideTabs, checkOverflow: () => true, validateTabsCount: () => false});
    api._setHiddenTabIDs = jest.fn(() => {});
    api.resize();
    expect(api._setHiddenTabIDs.mock.calls.length).toBe(1);
  });
});
describe('hideTabs method : ', () => {
  test('it should call _setHiddenTabIDs and showBtn methods', () => {
    renderApp();
    api.tabsCount = 0;
    api.api = {getData: () => ({openTabIDs: []})};
    api.tablistContainerEl = {style: {display: ''}};
    api.showBtn = jest.fn(() => {});
    api._setHiddenTabIDs = jest.fn(() => {});
    api.hideTabs(0, {index: 0});
    expect(api._setHiddenTabIDs.mock.calls.length).toBe(1);
    expect(api.showBtn.mock.calls.length).toBe(1);
  });
});
describe('validateTabsCount method : ', () => {
  test('it should set tabs and tabsCount properties', () => {
    renderApp();
    api.tablistEl = {children: {length: 2}};
    api.tabs = undefined;
    api.tabsCount = undefined;
    api.validateTabsCount({openTabIDs: ['1', '2']});
    expect(api.tabs).toEqual(api.tablistEl.children);
    expect(api.tabsCount).toEqual(api.tablistEl.children.length);
  });
  test('it should returns true if openTabIDs and tablist.children.length are equal', () => {
    renderApp();
    api.tablistEl = {children: {length: 2}};
    expect(api.validateTabsCount({openTabIDs: ['1', '2']})).toBe(true);
  });
  test('it should returns false if openTabIDs is an empty array', () => {
    renderApp();
    api.tablistEl = {children: {length: 2}};
    expect(api.validateTabsCount({openTabIDs: []})).toBe(false);
  });
  test('it should throws an error if openTabIDs and tablist.children.length are not equal', () => {
    expect.assertions(1);
    renderApp();
    api.tablistEl = {children: {length: 2}};
    try {
      api.validateTabsCount({openTabIDs: ['1']});
    } catch {
      expect(1).toBe(1);
    }
  });
});
describe('showAll method : ', () => {
  test('it should set display of tablistContainerEl to flex value', () => {
    renderApp();
    api.tablistContainerEl = {style: {display: ''}};
    api.tablistEl = {children: [{style: {display: ''}}, {style: {display: ''}}]};
    api.hideBtn = () => {};
    api.showAll();
    expect(api.tablistContainerEl.style.display).toBe('flex');
  });
  test('it should set display of all tabs to flex value', () => {
    renderApp();
    api.tablistContainerEl = {style: {display: ''}};
    api.tablistEl = {children: [{style: {display: ''}}, {style: {display: ''}}]};
    api.hideBtn = () => {};
    api.showAll();
    expect(api.tablistEl.children[0].style.display).toBe('flex');
    expect(api.tablistEl.children[1].style.display).toBe('flex');
  });
  test('it should call hideBtn method', () => {
    renderApp();
    api.tablistContainerEl = {style: {display: ''}};
    api.tablistEl = {children: [{style: {display: ''}}, {style: {display: ''}}]};
    api.hideBtn = jest.fn(() => {});
    api.showAll();
    expect(api.hideBtn.mock.calls.length).toBe(1);
  });
});
describe('findFirstHiddenTabIndexFactory mehtod : ', () => {
  test('its default value for returning is the last tab if it wont find it', () => {
    renderApp();
    api.tabsCount = 100;
    expect(api.findFirstHiddenTabIndexFactory({}, [1, 0], 'asc')).toBe(99);
    expect(api.findFirstHiddenTabIndexFactory({}, [1, 0], 'desc')).toBe(99);
  });
  test('it should call findFirstHiddenTabIndexASC method if order is asc', () => {
    renderApp();
    api.findFirstHiddenTabIndexASC = jest.fn(() => 1);
    api.findFirstHiddenTabIndexDSCE = jest.fn(() => 1);
    api.findFirstHiddenTabIndexFactory({}, [1, 0], 'asc');
    expect(api.findFirstHiddenTabIndexASC.mock.calls.length).toBe(1);
    expect(api.findFirstHiddenTabIndexDSCE.mock.calls.length).toBe(0);
  });
  test('it should call findFirstHiddenTabIndexDSCE method if order is desc', () => {
    renderApp();
    api.findFirstHiddenTabIndexASC = jest.fn(() => 1);
    api.findFirstHiddenTabIndexDSCE = jest.fn(() => 1);
    api.findFirstHiddenTabIndexFactory({}, [1, 0], 'desc');
    expect(api.findFirstHiddenTabIndexASC.mock.calls.length).toBe(0);
    expect(api.findFirstHiddenTabIndexDSCE.mock.calls.length).toBe(1);
  });
  test('the findFirstHiddenTabIndexASC method should return last tab index if the getTabDis method always returns a positive value', () => {
    renderApp();
    api.tabsCount = 100;
    api.tabs = Array(20).fill(0);
    api.getTabDis = () => 1;
    expect(api.findFirstHiddenTabIndexASC({}, 0, 10)).toBe(99);
  });
  test('the findFirstHiddenTabIndexDSCE method should return last tab index if the getTabDis method always returns a positive value', () => {
    renderApp();
    api.tabsCount = 100;
    api.tabs = Array(20).fill(0);
    api.getTabDis = () => 1;
    expect(api.findFirstHiddenTabIndexDSCE({}, 0, 10)).toBe(99);
  });
});
describe('getOrder method : ', () => {
  test('it should return asc if : last tab child distance from end-edge of tablist container would greater then tablist container size', () => {
    renderApp();
    api.els = {
      getDistance: () => ({value: 100}),
      getEl: () => ({getSize: () => 99}),
    };
    expect(api.getOrder()).toBe('asc');
  });
  it('it should return desc if : last tab child distance from end-edge of tablist container would equal or less then tablist container size', () => {
    renderApp();
    api.els = {
      getDistance: () => ({value: 100}),
      getEl: () => ({getSize: () => 101}),
    };
    expect(api.getOrder()).toBe('desc');
  });
});
describe('getSearchBoundries method : ', () => {
  test('it should return [0, tabsCount - 2] if there is not any tab selected', () => {
    renderApp();
    api.tabsCount = 10;
    const boundry = api.getSearchBoundries({index: -1});
    expect(boundry[0]).toBe(0); //start value
    expect(boundry[1]).toBe(api.tabsCount - 2); //stop value
  });
  test('it should return [0, selectedTabIndex - 1]  if selected tab is overflow', () => {
    renderApp();
    api.tabsCount = 10;
    const boundry = api.getSearchBoundries({index: 3, overflowFullSize: 1});
    expect(boundry[0]).toBe(0); //start value
    expect(boundry[1]).toBe(3 - 1); //stop value
  });
  test('it should return [selectedTabIndex + 1, tabsCount - 2]  if selected tab is not overflow', () => {
    renderApp();
    api.tabsCount = 10;
    const boundry = api.getSearchBoundries({index: 3, overflowFullSize: 0});
    expect(boundry[0]).toBe(3 + 1); //start value
    expect(boundry[1]).toBe(10 - 2); //stop value
  });
});
describe('hideBtn method : ', () => {
  test(`it should not hide the button, because the button size is needed when all tabs are visible 
  but the button should not be visible`, () => {
    renderApp();
    api.btnRef = {current: {style: {display: 'flex', position: 'relative', opacity: 1, pointerEvents: 'all'}}};
    api.hideBtn();
    expect(api.btnRef.current.style.display).toBe('flex');
    expect(api.btnRef.current.style.opacity).toBe(0);
    expect(api.btnRef.current.style.position).toBe('absolute');
    expect(api.btnRef.current.style.pointerEvents).toBe('none');
  });
});
