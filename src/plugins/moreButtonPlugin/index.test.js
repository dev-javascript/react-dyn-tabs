/* eslint-disable react/prop-types */
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import useDynTabs from '../../index.js';
import MoreButtonPlugin from './index.js';
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
  };
  App = function App({options, plugins = []}) {
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
    //expect.assertions(1);
    renderApp();
    return act(() => {});
  });
});
