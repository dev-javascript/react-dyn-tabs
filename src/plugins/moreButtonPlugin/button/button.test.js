/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';
import { unmountComponentAtNode } from 'react-dom';
import ButtonComponent from './button.js';
import PopperComponent from './popper/popper.js';
import renderer from 'react-test-renderer';
import optionManager from '../../../../utils/api/optionManager/optionManager.js';
import { Tabs } from '../../../../tabList/tabList.js';
let container = document.createElement('div');
const Popper = forwardRef(
  PopperComponent.bind(null, {
    createPopper: () => { },
    getPopperMaxHeight: () => 200,
    clk: () => { },
  }),
);
const Button = ButtonComponent.bind(null, () => ({ Popper }));
const opManager = new optionManager({ options: {} });
const st = opManager.setting;
const getApi = (props = {}) =>
  Object.assign({}, { on: () => { }, of: () => { }, getData: () => ({ selectedTabID: '0' }), getOption: () => 'ltr' }, props);

beforeAll(() => {
  document.body.appendChild(container);
});
beforeEach(() => { });
afterEach(() => {
  unmountComponentAtNode(container);
  container.innerHTML = '';
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
});
describe('Default show more button structure : ', () => {
  test('default', () => {
    const tree = renderer
      .create(
        <div className={st.tabClass + ' ' + st.showMoreContainerClass}>
          <Button
            hiddenTabIDs={'1,2'}
            instance={getApi()}
            TabsComponent={Tabs}
            buttonClassName={st.titleClass + ' ' + st.showMoreButtonClass}
            popperClassName={st.tablistViewClass + ' ' + st.verticalClass + ' ' + st.showMorePopperClass}
          />
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('different hiddenTabIDs', () => {
    const tree = renderer
      .create(
        <div className={st.tabClass + ' ' + st.showMoreContainerClass}>
          <Button
            hiddenTabIDs={'1,3,4'}
            instance={getApi()}
            TabsComponent={Tabs}
            buttonClassName={st.titleClass + ' ' + st.showMoreButtonClass}
            popperClassName={st.tablistViewClass + ' ' + st.verticalClass + ' ' + st.showMorePopperClass}
          />
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('rtl mode', () => {
    const tree = renderer
      .create(
        <div className={st.tabClass + ' ' + st.showMoreContainerClass}>
          <Button
            hiddenTabIDs={'1,2'}
            instance={getApi({ getOption: () => 'rtl' })}
            TabsComponent={Tabs}
            buttonClassName={st.titleClass + ' ' + st.showMoreButtonClass}
            popperClassName={
              st.tablistViewClass + ' ' + st.verticalClass + ' ' + st.rtlClass + ' ' + st.showMorePopperClass
            }
          />
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
