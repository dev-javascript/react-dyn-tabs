/* eslint-disable react/prop-types */
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import useDynTabs from './index.js';
import {act} from 'react-dom/test-utils';
let container = document.createElement('div');
let App, instance, ready, renderApp, op; //options
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
    ],
    selectedTabID: '1',
    onFirstSelect: jest.fn(function () {}),
    onSelect: jest.fn(function () {}),
    onChange: jest.fn(function () {}),
    onInit: jest.fn(function () {}),
    onClose: jest.fn(function () {}),
    onOpen: jest.fn(function () {}),
    onLoad: jest.fn(function () {}),
    beforeClose: jest.fn(function () {}),
    beforeSelect: jest.fn(function () {}),
    onDestroy: jest.fn(function () {}),
  };
  App = function App({options}) {
    const _options = Object.assign({}, op, options);
    if (_options.tabs) {
      const _tabs = [];
      _options.tabs.map((tab) => {
        _tabs.push({...tab});
      });
      _options.tabs = _tabs;
    }
    const [Tablist, Panellist, readyFunction] = useDynTabs(_options);
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
  renderApp = (options = {}) => {
    act(() => {
      render(<App options={options}></App>, container);
    });
  };
});
afterEach(() => {
  unmountComponentAtNode(container);
  container.innerHTML = '';
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
describe('apply multiple actions : ', () => {
  test('calling close function when select action is done', () => {
    expect.assertions(1);
    renderApp();
    return act(() => {
      return instance.select('2').then(() => {
        return instance.close('2').then(() => {
          expect(document.querySelector('[tab-id="1"]').className.includes('rc-dyn-tabs-selected')).toBe(true);
        });
      });
    });
  });
  test('opening new tab and closing selected tab', () => {
    let _api;
    act(() => {
      const App = function () {
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
          panelComponent: <p>tab3 content</p>,
        });
      if (_api.isOpen('1')) _api.close('1');
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
      if (instance.getTab('1').closable == true) instance.setTab('1', {closable: false});
      if (instance.getOption('direction') === 'ltr') {
        instance.setOption('direction', 'rtl');
        instance.setOption('tabComponent', function (props) {
          return (
            <a {...props.tabProps}>
              {props.children}
              {Object.prototype.hasOwnProperty.call(props, 'iconProps') && <span {...props.iconProps}></span>}
            </a>
          );
        });
        instance.one('onInit', function () {
          this.setTab('1', {
            panelComponent: function panelComponent() {
              return <div id="updatedPanel1"></div>;
            },
          }).refresh();
        });
        instance.refresh();
      }
    });
    expect(document.getElementById('updatedPanel1') != null).toBe(true);
    expect(document.querySelector('li[tab-id="1"] .rc-dyn-tabs-close')).toBe(null);
    expect(document.querySelector('ul').className.includes('rc-dyn-tabs-rtl')).toBe(true);
    expect(document.querySelectorAll('a.rc-dyn-tabs-title').length === 2).toBe(true);
    expect(op.onChange.mock.calls.length).toBe(0);
    expect(op.onInit.mock.calls.length).toBe(3);
  });
  test('checking events execution count', () => {
    expect.assertions(10);
    const onSelectHandler = jest.fn(() => {});
    renderApp();
    act(() => {
      instance.one('onSelect', onSelectHandler);
      instance.open({
        id: '3',
        title: 'mock tab 3',
        closable: true,
        panelComponent: <p>tab3 content</p>,
      });
      instance.close('1');
    });
    expect(op.onLoad.mock.calls.length).toBe(1);
    expect(op.onInit.mock.calls.length).toBe(2);
    expect(op.onChange.mock.calls.length).toBe(1);
    expect(onSelectHandler.mock.calls.length).toBe(1);
    expect(op.onFirstSelect.mock.calls.length).toBe(1);
    expect(op.onSelect.mock.calls.length).toBe(1);
    expect(op.onClose.mock.calls.length).toBe(1);
    expect(op.onOpen.mock.calls.length).toBe(1);
    expect(op.beforeClose.mock.calls.length).toBe(0);
    expect(op.beforeSelect.mock.calls.length).toBe(0);
  });
});
describe('lazy tabs : ', () => {
  const LazyPanel = function LazyPanel() {
    const Panel = React.lazy(() => import('./mock/mock-lazy-panel-1.js'));
    return (
      <React.Suspense fallback={<p>loading...</p>}>
        <Panel></Panel>
      </React.Suspense>
    );
  };
  const renderLazyApp = () =>
    renderApp({
      tabs: [
        {
          id: '1',
          title: 'mock tab 1',
          lazy: true,
          panelComponent: function Panel() {
            return <p>tab1 content</p>;
          },
        },
        {
          id: '2',
          title: 'mock tab 2',
          panelComponent: function Panel() {
            return <p>tab2 content</p>;
          },
        },
        {
          id: '3',
          title: 'mock tab 3',
          lazy: true,
          panelComponent: function Panel() {
            return <p>tab3 content</p>;
          },
        },
        {
          id: '4',
          title: 'mock tab 4',
          lazy: true,
          panelComponent: LazyPanel,
        },
      ],
    });
  test('lazy panels should be null initially expect selected panel', () => {
    expect.assertions(16);
    renderLazyApp();
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="1"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="2"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="3"] p') === null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="4"] p') === null).toBe(true);
    act(() => {
      instance.select('4');
      instance.select('3');
    });
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="1"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="2"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="3"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="4"] p') === null).toBe(true);
    act(() => {
      instance.select('4');
    });
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="1"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="2"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="3"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="4"] p') !== null).toBe(true);
    act(() => {
      instance.select('3');
    });
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="1"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="2"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="3"] p') !== null).toBe(true);
    expect(document.querySelector('.rc-dyn-tabs-panel[tab-id="4"] p') !== null).toBe(true);
  });
});
describe('calling some action inside the events options', () => {
  test('select method can be called inside the onLoad option', () => {
    op.onLoad = jest.fn(function () {
      this.select('2');
    });
    renderApp();
    expect(instance.getData().selectedTabID === '2').toBe(true);
    expect(op.onLoad.mock.calls.length === 1).toBe(true);
    expect(op.onInit.mock.calls.length === 2).toBe(true);
    expect(op.onChange.mock.calls.length === 1).toBe(true);
    expect(op.onFirstSelect.mock.calls.length === 1).toBe(true);
    expect(op.onSelect.mock.calls.length === 1).toBe(true);
  });
});
describe('select method : ', () => {
  test('it should fire onInit event then onChange and then onSelect evnets', () => {
    const onSelect = jest.fn(() => {});
    renderApp();
    act(() => {
      instance.one('onSelect', onSelect).select('2');
    });
    expect(op.onInit.mock.calls.length === 2).toBe(true);
    expect(op.onChange.mock.calls.length === 1).toBe(true);
    expect(op.onSelect.mock.calls.length === 1).toBe(true);
    expect(onSelect.mock.calls[0][0]).toEqual({
      currentSelectedTabId: '2',
      perviousSelectedTabId: '1',
      previousSelectedTabId: '1',
    });
    expect(op.onInit).toHaveBeenCalledBefore(op.onChange);
    expect(op.onChange).toHaveBeenCalledBefore(op.onSelect);
    expect(op.onSelect).toHaveBeenCalledBefore(onSelect);
  });
  test('select Promise is resolved with {currentData,instance} parameter after onSelect event', () => {
    expect.assertions(6);
    renderApp();
    return act(() => {
      return instance.select('2').then((result) => {
        expect(result.currentData).toEqual(instance.getData());
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
      return instance.select('1').then(() => {
        expect(op.onChange.mock.calls.length === 0).toBe(true);
        expect(op.onInit.mock.calls.length === 2).toBe(true);
      });
    });
  });
  test('selecting none existent tab', () => {
    expect.assertions(4);
    renderApp();
    return act(() => {
      return instance.select('3').then(() => {
        expect(document.querySelector('.rc-dyn-tabs-selected') == null).toBe(true);
        expect(instance.getData().selectedTabID === '3').toBe(true);
        expect(op.onChange.mock.calls.length === 1).toBe(true);
        expect(op.onInit.mock.calls.length === 2).toBe(true);
      });
    });
  });
});
describe('close method : ', () => {
  test('it should fire onInit event then onChange and then onClose evnets', () => {
    const onClose = jest.fn(() => {});
    renderApp();
    act(() => {
      instance.one('onClose', onClose).close('2');
    });
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
      return instance.close('2').then((result) => {
        expect(result.currentData).toEqual(instance.getData());
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
      return instance.close('4').then(() => {
        expect(op.onChange.mock.calls.length === 0).toBe(true);
        expect(op.onInit.mock.calls.length === 2).toBe(true);
      });
    });
  });
});
describe('open method : ', () => {
  test('it should fire onInit event then onChange and then onOpen evnets', () => {
    const onOpen = jest.fn(() => {});
    renderApp();
    act(() => {
      instance.one('onOpen', onOpen).open({
        id: '3',
        title: 'tab3',
      });
      instance.open({
        id: '4',
        title: 'tab4',
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
      return instance
        .open({
          id: '3',
          title: 'tab3',
        })
        .then((result) => {
          expect(result.currentData).toEqual(instance.getData());
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
      return instance.open(op.tabs[0]).then(() => {
        expect(op.onChange.mock.calls.length === 0).toBe(true);
        expect(op.onInit.mock.calls.length === 2).toBe(true);
        expect(instance.getData().openTabIDs.length === 2).toBe(true);
      });
    });
  });
});
describe('refresh method : ', () => {
  test('it should fire onInit event', () => {
    renderApp();
    act(() => {
      instance.refresh();
    });
    expect(op.onInit.mock.calls.length === 2).toBe(true);
    expect(op.onChange.mock.calls.length === 0).toBe(true);
  });
  test('refresh Promise is resolved with {currentData,instance} parameter after onInit event', () => {
    expect.assertions(4);
    renderApp();
    return act(() => {
      return instance.refresh().then((result) => {
        expect(result.currentData).toEqual(instance.getData());
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
    const onLoad = jest.fn(() => {});
    const onInit = jest.fn(() => {});
    renderApp();
    return act(() => {
      ready((instance) => {
        instance.one('onLoad', onLoad).one('onInit', onInit);
      });
      return instance.refresh().then(() => {
        expect(op.onLoad.mock.calls.length === 1).toBe(true);
        expect(op.onInit.mock.calls.length === 2).toBe(true);
        expect(onInit.mock.calls.length === 1).toBe(true);
        expect(onLoad.mock.calls.length === 0).toBe(true);
      });
    });
  });
  test('it calls its function parameter after onLoad event and first execution of onInit event', () => {
    expect.assertions(6);
    const onReady = jest.fn(() => {});
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
describe('onLoad callback : ', () => {
  test('onLoad callback should be called once time initially without any parameters', () => {
    renderApp();
    expect(op.onLoad.mock.calls.length).toBe(1);
    expect(op.onLoad.mock.calls[0].length).toBe(0);
    act(() => {
      instance.select('3');
      instance.close('1');
      instance.open({id: '3'});
      instance.refresh();
    });
    expect(op.onLoad.mock.calls.length).toBe(1);
  });
  test('checking context of onLoad callback', () => {
    expect.assertions(2);
    op.onLoad = jest.fn(function () {
      expect(Object.prototype.toString.call(this)).toBe('[object Object]');
      expect(this.hasOwnProperty('getData')).toBe(true);
    });
    renderApp();
    op.onLoad = function () {};
  });
});
describe('onInit callback : ', () => {
  test('onInit callback should be called initially without any parameters', () => {
    renderApp();
    expect(op.onInit.mock.calls.length).toBe(1);
    expect(op.onInit.mock.calls[0].length).toBe(0);
  });
  test('checking context of onInit callback', () => {
    expect.assertions(2);
    op.onInit = jest.fn(function () {
      expect(Object.prototype.toString.call(this)).toBe('[object Object]');
      expect(this.hasOwnProperty('getData')).toBe(true);
    });
    renderApp();
    op.onInit = function () {};
  });
});
describe('onChange callback : ', () => {
  test(`onChange is called with {currentData,previousData,perviousData,openedTabIDs,closedTabIDs} 
    object as a parameter`, () => {
    renderApp();
    act(() => {
      instance.select('2');
    });
    expect(op.onChange.mock.calls.length).toBe(1);
    expect(op.onChange.mock.calls[0][0]).toEqual({
      currentData: {selectedTabID: '2', openTabIDs: ['1', '2']},
      previousData: {selectedTabID: '1', openTabIDs: ['1', '2']},
      perviousData: {selectedTabID: '1', openTabIDs: ['1', '2']},
      openedTabIDs: [],
      closedTabIDs: [],
    });
    expect(op.onChange.mock.calls[0][0].currentData).toEqual(instance.getData());
    expect(op.onChange.mock.calls[0][0].previousData).toEqual(instance.getPreviousData());
  });
  test('it is not called initially', () => {
    renderApp();
    expect(op.onChange.mock.calls.length).toBe(0);
  });
  test('onChange parameters should be immutable', () => {
    renderApp();
    const onChange1 = jest.fn(({currentData, previousData, closedTabIDs, openedTabIDs}) => {
      closedTabIDs.push('6');
      openedTabIDs.push('6');
      currentData.selectedTabID = '6';
      previousData.selectedTabID = '6';
    });
    const onChange2 = jest.fn(({currentData, previousData, closedTabIDs, openedTabIDs}) => {});
    const onOpen = jest.fn(() => {});
    const onClose = jest.fn(() => {});
    const onSelect = jest.fn(() => {});
    const onFirstSelect = jest.fn(() => {});
    act(() => {
      instance.setOption('onChange', ({currentData, previousData, closedTabIDs, openedTabIDs}) => {
        closedTabIDs.push('5');
        openedTabIDs.push('5');
        currentData.selectedTabID = '5';
        previousData.selectedTabID = '5';
      });
      instance.one('onChange', onChange1);
      instance.on('onChange', onChange2);
      instance.on('onOpen', onOpen);
      instance.on('onClose', onClose);
      instance.on('onSelect', onSelect);
      instance.on('onFirstSelect', onFirstSelect);
      instance.close('2');
      instance.open({id: '3'});
      instance.select('3');
    });

    expect(onSelect.mock.calls[0][0]).toEqual({
      currentSelectedTabId: '3',
      perviousSelectedTabId: '1',
      previousSelectedTabId: '1',
    });
    expect(onFirstSelect.mock.calls[0][0]).toEqual({
      currentSelectedTabId: '3',
      previousSelectedTabId: '1',
    });
    expect(onClose.mock.calls[0][0]).toEqual(['2']);
    expect(onOpen.mock.calls[0][0]).toEqual(['3']);
    expect(onChange2.mock.calls[0][0]).toEqual({
      currentData: {selectedTabID: '3', openTabIDs: ['1', '3']},
      previousData: {selectedTabID: '1', openTabIDs: ['1', '2']},
      perviousData: {selectedTabID: '1', openTabIDs: ['1', '2']},
      closedTabIDs: ['2'],
      openedTabIDs: ['3'],
    });
  });
  test('checking context of onChange callback', () => {
    expect.assertions(2);
    op.onChange = jest.fn(function () {
      expect(Object.prototype.toString.call(this)).toBe('[object Object]');
      expect(this.hasOwnProperty('getData')).toBe(true);
    });
    renderApp();
    act(() => {
      instance.select('2');
    });
    op.onChange = function () {};
  });
});
describe('onSelect callback : ', () => {
  test('onSelect is called with {currentSelectedTabId,previousSelectedTabId,perviousSelectedTabId} object as a parameter', () => {
    renderApp();
    act(() => {
      instance.select('2');
    });
    expect(op.onSelect.mock.calls.length).toBe(1);
    expect(op.onSelect.mock.calls[0][0]).toEqual({
      currentSelectedTabId: '2',
      perviousSelectedTabId: '1',
      previousSelectedTabId: '1',
    });
  });
  test('it is not called initially', () => {
    renderApp();
    expect(op.onSelect.mock.calls.length).toBe(0);
  });
  test('onSelect parameters should be immutable', () => {
    renderApp();
    const onSelect1 = jest.fn((param) => {
      param.previousSelectedTabId = 19;
    });
    const onSelect2 = jest.fn((param) => {});
    act(() => {
      instance.setOption('onSelect', (param) => {
        param.currentSelectedTabId = 10;
      });
      instance.on('onSelect', onSelect1);
      instance.on('onSelect', onSelect2);
      instance.select('2');
    });
    expect(onSelect2.mock.calls[0][0]).toEqual({
      currentSelectedTabId: '2',
      perviousSelectedTabId: '1',
      previousSelectedTabId: '1',
    });
  });
  test('checking context of onSelect callback', () => {
    expect.assertions(2);
    op.onSelect = jest.fn(function () {
      expect(Object.prototype.toString.call(this)).toBe('[object Object]');
      expect(this.hasOwnProperty('getData')).toBe(true);
    });
    renderApp();
    act(() => {
      instance.select('2');
    });
    op.onSelect = function () {};
  });
});
describe('onFirstSelect callback : ', () => {
  test('it is not triggered initially', () => {
    renderApp();
    expect(op.onFirstSelect.mock.calls.length).toBe(0);
  });
  test('it is triggered at most once per each tab, before onSelect event. if the tab has not been selected yet', () => {
    renderApp();
    expect(op.onFirstSelect.mock.calls.length).toBe(0);
    expect(op.onSelect.mock.calls.length).toBe(0);
    act(() => {
      instance.select('2');
    });
    expect(op.onFirstSelect.mock.calls.length).toBe(1);
    expect(op.onSelect.mock.calls.length).toBe(1);
    expect(op.onFirstSelect).toHaveBeenCalledBefore(op.onSelect);
    act(() => {
      instance.select('1');
    });
    act(() => {
      instance.select('2');
    });
    expect(op.onFirstSelect.mock.calls.length).toBe(1);
    expect(op.onSelect.mock.calls.length).toBe(3);
  });
  test('onFirstSelect is called with {currentSelectedTabId,previousSelectedTabId} object as a parameter', () => {
    renderApp();
    act(() => {
      instance.select('2');
    });
    expect(op.onFirstSelect.mock.calls[0][0]).toEqual({
      currentSelectedTabId: '2',
      previousSelectedTabId: '1',
    });
  });
  test('onFirstSelect parameters should be immutable', () => {
    renderApp();
    const onFirstSelect1 = jest.fn((param) => {
      param.previousSelectedTabId = 19;
    });
    const onFirstSelect2 = jest.fn((param) => {});
    act(() => {
      instance.setOption('onFirstSelect', (param) => {
        param.currentSelectedTabId = 10;
      });
      instance.on('onFirstSelect', onFirstSelect1);
      instance.on('onFirstSelect', onFirstSelect2);
      instance.select('2');
    });
    expect(onFirstSelect2.mock.calls[0][0]).toEqual({
      currentSelectedTabId: '2',
      previousSelectedTabId: '1',
    });
  });
  test('checking context of onFirstSelect callback', () => {
    expect.assertions(2);
    op.onFirstSelect = jest.fn(function () {
      expect(Object.prototype.toString.call(this)).toBe('[object Object]');
      expect(this.hasOwnProperty('getData')).toBe(true);
    });
    renderApp();
    act(() => {
      instance.select('2');
    });
    op.onFirstSelect = function () {};
  });
});
describe('onOpen callback : ', () => {
  test('checking onOpen parameters', () => {
    renderApp();
    act(() => {
      instance.open({id: '3'});
    });
    expect(op.onOpen.mock.calls.length).toBe(1);
    expect(op.onOpen.mock.calls[0][0]).toEqual(['3']);
  });
  test('it is not called initially', () => {
    renderApp();
    expect(op.onOpen.mock.calls.length).toBe(0);
  });
  test('onOpen parameters should be immutable', () => {
    renderApp();
    const onOpen1 = jest.fn((openedTabIDs) => {
      openedTabIDs.push('5');
    });
    const onOpen2 = jest.fn((openedTabIDs) => {});
    act(() => {
      instance.setOption('onOpen', (openedTabIDs) => {
        openedTabIDs.push('4');
      });
      instance.on('onOpen', onOpen1);
      instance.on('onOpen', onOpen2);
      instance.open({id: '3'});
    });
    expect(onOpen2.mock.calls[0][0]).toEqual(['3']);
  });
  test('checking context of onOpen callback', () => {
    expect.assertions(2);
    op.onOpen = jest.fn(function () {
      expect(Object.prototype.toString.call(this)).toBe('[object Object]');
      expect(this.hasOwnProperty('getData')).toBe(true);
    });
    renderApp();
    act(() => {
      instance.open({id:'3'});
    });
    op.onOpen = function () {};
  });
});
describe('onClose callback : ', () => {
  test('checking onClose parameters', () => {
    renderApp();
    act(() => {
      instance.close('2');
    });
    expect(op.onClose.mock.calls.length).toBe(1);
    expect(op.onClose.mock.calls[0][0]).toEqual(['2']);
  });
  test('it is not called initially', () => {
    renderApp();
    expect(op.onClose.mock.calls.length).toBe(0);
  });
  test('onClose parameters should be immutable', () => {
    renderApp();
    const onClose1 = jest.fn((closedTabIDs) => {
      closedTabIDs.push('4');
    });
    const onClose2 = jest.fn((closedTabIDs) => {});
    act(() => {
      instance.setOption('onClose', (closedTabIDs) => {
        closedTabIDs.push('3');
      });
      instance.on('onClose', onClose1);
      instance.on('onClose', onClose2);
      instance.close('2');
    });
    expect(onClose2.mock.calls[0][0]).toEqual(['2']);
  });
  test('checking context of onClose callback', () => {
    expect.assertions(2);
    op.onClose = jest.fn(function () {
      expect(Object.prototype.toString.call(this)).toBe('[object Object]');
      expect(this.hasOwnProperty('getData')).toBe(true);
    });
    renderApp();
    act(() => {
      instance.close('2');
    });
    op.onClose = function () {};
  });
});
