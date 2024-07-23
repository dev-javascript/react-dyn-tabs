import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
import TablistView from './tablistView.js';
import renderer from 'react-test-renderer';
import Api from '../utils/api/api.js';
let container = document.createElement('div'),
  realUseContext;
const setMockUseContext = (op = {}) => {
  const instance = new Api({options: Object.assign({}, op)});
  React.useContext = jest.fn(() => instance);
};
beforeAll(() => {
  document.body.appendChild(container);
  realUseContext = React.useContext;
});
beforeEach(() => {});
afterEach(() => {
  unmountComponentAtNode(container);
  container.innerHTML = '';
  React.useContext = realUseContext;
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
});
describe('TabListView structure : ', () => {
  test('default options', () => {
    setMockUseContext();
    const tree = renderer
      .create(
        <div>
          <TablistView></TablistView>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('rtl option', () => {
    setMockUseContext({direction: 'rtl'});
    const tree = renderer
      .create(
        <div>
          <TablistView></TablistView>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('isVertical option', () => {
    setMockUseContext({isVertical: true});
    const tree = renderer
      .create(
        <div>
          <TablistView></TablistView>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('children props', () => {
    setMockUseContext();
    const tree = renderer
      .create(
        <div>
          <TablistView>
            <div className="rc-dyn-tabs-tablist-container" />
          </TablistView>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('style option', () => {
    setMockUseContext({tablistStyle: {backgroundColor: 'red'}});
    const tree = renderer
      .create(
        <div>
          <TablistView></TablistView>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
