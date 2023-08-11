import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
import TablistContainer from './tablistContainer';
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
describe('TablistContainer structure : ', () => {
  test('default options', () => {
    setMockUseContext();
    const tree = renderer
      .create(
        <div>
          <TablistContainer></TablistContainer>
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
          <TablistContainer>
            <div className="rc-dyn-tabs-tablist-overflow" />
          </TablistContainer>
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
