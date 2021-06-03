import React, {useState} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import Tab from './tab';
import {act} from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import DefaultTabInner from './defaulTabInner.js';
import Api from '../utils/api/api.js';
let container = document.createElement('div'),
  realUseContext;
const getDefaultApi = () => ({
  tabs: [
    {id: '1', title: 'tab1', tooltip: 'tab1 tootltip', closable: false},
    {id: '2', title: 'tab2', iconClass: 'ui-icon ui-icon-disk'},
    {id: '3', title: 'tab3', disable: true},
    {id: '4', title: 'tab4', panelComponent: (props) => <div>tab4</div>},
  ],
});
const setMockUseContext = (op = {}) => {
  React.useContext = jest.fn(() => new Api({options: Object.assign({}, getDefaultApi(), op)}));
};
beforeAll(() => {
  document.body.appendChild(container);
  realUseContext = React.useContext;
});
beforeEach(() => {
  setMockUseContext();
});
afterEach(() => {
  unmountComponentAtNode(container);
  container.innerHTML = '';
  React.useContext = realUseContext;
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
});
describe('tab structure with default options : ', () => {
  test('default tab data', () => {
    setMockUseContext({
      tabs: [
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: false,
          id: '1',
        },
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: false,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('none closable tab', () => {
    setMockUseContext({
      tabs: [
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: false,
          iconClass: '',
          disable: false,
          id: '1',
        },
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: false,
          iconClass: '',
          disable: false,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('disabled tab', () => {
    setMockUseContext({
      tabs: [
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: true,
          id: '1',
        },
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: true,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('tab with provided tooltip and iconClass', () => {
    setMockUseContext({
      tabs: [
        {
          title: 'tab title',
          tooltip: 'tab tooltip',
          panelComponent: null,
          closable: true,
          iconClass: 'ui-icon ui-icon-heart',
          disable: false,
          id: '1',
        },
        {
          title: 'tab title',
          tooltip: 'tab tooltip',
          panelComponent: null,
          closable: true,
          iconClass: 'ui-icon ui-icon-heart',
          disable: false,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('tab structure with rtl and none accessibility options : ', () => {
  test('default tab data', () => {
    setMockUseContext({
      accessibility: false,
      direction: 'rtl',
      tabs: [
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: false,
          id: '1',
        },
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: false,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('none closable tab', () => {
    setMockUseContext({
      accessibility: false,
      direction: 'rtl',
      tabs: [
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: false,
          iconClass: '',
          disable: false,
          id: '1',
        },
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: false,
          iconClass: '',
          disable: false,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('disabled tab', () => {
    setMockUseContext({
      accessibility: false,
      direction: 'rtl',
      tabs: [
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: true,
          id: '1',
        },
        {
          title: '',
          tooltip: '',
          panelComponent: null,
          closable: true,
          iconClass: '',
          disable: true,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('tab with provided tooltip and iconClass', () => {
    setMockUseContext({
      accessibility: false,
      direction: 'rtl',
      tabs: [
        {
          title: 'tab title',
          tooltip: 'tab tooltip',
          panelComponent: null,
          closable: true,
          iconClass: 'ui-icon ui-icon-heart',
          disable: false,
          id: '1',
        },
        {
          title: 'tab title',
          tooltip: 'tab tooltip',
          panelComponent: null,
          closable: true,
          iconClass: 'ui-icon ui-icon-heart',
          disable: false,
          id: '2',
        },
      ],
    });
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('tab structure with custom tab component : ', () => {
  test('default options', () => {
    setMockUseContext({tabComponent: DefaultTabInner});
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
          <Tab id="3" selectedTabID="1"></Tab>
          <Tab id="4" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('rtl and none accessibility options', () => {
    setMockUseContext({tabComponent: DefaultTabInner, direction: 'rtl', accessibility: false});
    const tree = renderer
      .create(
        <div>
          <Tab id="1" selectedTabID="1"></Tab>
          <Tab id="2" selectedTabID="1"></Tab>
          <Tab id="3" selectedTabID="1"></Tab>
          <Tab id="4" selectedTabID="1"></Tab>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
