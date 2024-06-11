import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
import Tab from './tab.js';
import renderer from 'react-test-renderer';
import DefaultTabInner from './defaulTabInner.js';
import Api from '../utils/api/api.js';
const tabComponent = function (props) {
  const tabProps = props.tabProps;
  tabProps.className += ' userTabComponent';
  return <DefaultTabInner {...props} tabProps={tabProps} />;
};
let container = document.createElement('div'),
  realUseContext;
const getDefaultApi = () => ({
  tabs: [
    {id: '1', title: 'tab1', tooltip: 'tab1 tootltip', closable: false},
    {id: '2', title: 'tab2', iconClass: 'ui-icon ui-icon-disk'},
    {id: '3', title: 'tab3', disable: true},
    {
      id: '4',
      title: 'tab4',
      panelComponent: function panelComponent4() {
        return <div>tab4</div>;
      },
    },
  ],
});
const setMockUseContext = (op) => {
  op = op || {};
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
          title: 'tab1',
          tooltip: 'tab1',
          panelComponent: null,
          id: '1',
        },
        {
          title: 'tab2',
          tooltip: 'tab2',
          panelComponent: null,
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
          title: 'tab1',
          tooltip: 'tab1',
          panelComponent: null,
          closable: false,
          iconClass: '',
          disable: false,
          id: '1',
        },
        {
          title: 'tab2',
          tooltip: 'tab2',
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
          title: 'tab1',
          tooltip: 'tab1',
          panelComponent: null,
          disable: true,
          id: '1',
        },
        {
          title: 'tab2',
          tooltip: 'tab2',
          panelComponent: null,
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
          title: 'tab1',
          tooltip: 'tab1',
          panelComponent: null,
          iconClass: 'ui-icon ui-icon-home',
          id: '1',
        },
        {
          title: 'tab2',
          tooltip: 'tab2',
          panelComponent: null,
          iconClass: 'ui-icon ui-icon-book',
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
          title: 'tab1',
          panelComponent: null,
          id: '1',
        },
        {
          title: 'tab2',
          panelComponent: null,
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
          title: 'tab1',
          panelComponent: null,
          closable: false,
          id: '1',
        },
        {
          title: 'tab2',
          panelComponent: null,
          closable: false,
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
          title: 'tab1',
          panelComponent: null,
          disable: true,
          id: '1',
        },
        {
          title: 'tab2',
          panelComponent: null,
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
          title: 'tab1',
          tooltip: 'tab1',
          panelComponent: null,
          iconClass: 'ui-icon ui-icon-home',
          id: '1',
        },
        {
          title: 'tab2',
          tooltip: 'tab2',
          panelComponent: null,
          iconClass: 'ui-icon ui-icon-heart',
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
    setMockUseContext({tabComponent});
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
    setMockUseContext({tabComponent, direction: 'rtl', accessibility: false});
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
