/* eslint-disable react/prop-types */
import React, {memo} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import ButtonComponent from './button.js';
import renderer from 'react-test-renderer';
import components from '../../../components/index.js';
import CTx from '../../../utils/api/index.js';
import Api from './api.js';
import {ApiContext, StateContext} from '../../../context.js';
import {setSetting} from '../setComponents.js';
const getIns = (op) => {
  const ins = new CTx(op);
  setSetting(ins);
  return ins;
};
let container = document.createElement('div');
const getButton = (ctx) =>
  memo(
    ButtonComponent.bind(null, () => ({
      ctx,
      components,
      Popper: (props) => (
        <div id="popperID" {...props}>
          mock popper
        </div>
      ),
      Api,
    })),
  );
const getBtn = () => document.getElementsByClassName('rc-dyn-tabs-showmorebutton')[0];
const moreButtonPlugin_iconComponent = (props) => <div {...props}>more button mock icon</div>;
beforeAll(() => {
  document.body.appendChild(container);
});
let userProxy = {};
beforeEach(() => {
  const ins = getIns({
    options: {},
  });
  userProxy = ins.userProxy;
});
afterEach(() => {
  unmountComponentAtNode(container);
  container.innerHTML = '';
});
afterAll(() => {
  document.body.removeChild(container);
  container = null;
});
describe('Enable Accesibility : ', () => {
  test('DEFAULT:', () => {
    const Button = getButton(
      getIns({
        options: {
          moreButtonPlugin_iconComponent,
        },
      }),
    );
    const tree = renderer
      .create(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('MULTIPLE BUTTON SHOULD NOT HAVE SAME ID:', () => {
    const Button = getButton(
      getIns({
        options: {
          moreButtonPlugin_iconComponent,
        },
      }),
    );
    const tree = renderer
      .create(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('DISABLE ACCESIBILITY : ', () => {
  test('DEFAULT:', () => {
    const Button = getButton(
      getIns({
        options: {
          moreButtonPlugin_iconComponent,
          accessibility: false,
        },
      }),
    );
    const tree = renderer
      .create(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
describe('OPEN AND CLOSE POPPER:', () => {
  test('BUTTON CLICK:', () => {
    const Button = getButton(
      getIns({
        options: {
          moreButtonPlugin_iconComponent,
          //accessibility: false,
        },
      }),
    );
    act(() => {
      render(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
        container,
      );
    });
    act(() => {
      getBtn().click();
    });
    expect(document.getElementById('popperID') != null).toBe(true);
    expect(getBtn().getAttribute('aria-expanded')).toBe('true');
    act(() => {
      getBtn().click();
    });
    expect(document.getElementById('popperID') != null).toBe(false);
    expect(getBtn().getAttribute('aria-expanded') == 'true').toBe(false);
  });
  test('document click:', () => {
    const Button = getButton(
      getIns({
        options: {
          moreButtonPlugin_iconComponent,
        },
      }),
    );
    act(() => {
      render(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
        container,
      );
    });
    act(() => {
      getBtn().click();
    });
    expect(document.getElementById('popperID') != null).toBe(true);
    expect(getBtn().getAttribute('aria-expanded')).toBe('true');
    act(() => {
      document.body.click();
    });
    expect(document.getElementById('popperID') != null).toBe(false);
    expect(getBtn().getAttribute('aria-expanded') == 'true').toBe(false);
  });
  test('select tab:', () => {
    const ins = getIns({
      options: {
        moreButtonPlugin_iconComponent,
      },
    });
    const Button = getButton(ins);
    act(() => {
      render(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
        container,
      );
    });
    act(() => {
      getBtn().click();
    });
    expect(document.getElementById('popperID') != null).toBe(true);
    expect(getBtn().getAttribute('aria-expanded')).toBe('true');
    act(() => {
      ins.trigger('onSelect');
    });
    expect(document.getElementById('popperID') != null).toBe(false);
    expect(getBtn().getAttribute('aria-expanded') == 'true').toBe(false);
  });
  test('onmount:', () => {
    let ref;
    const api = function (components, setOpen) {
      ref = (Api.default || Api).call(this, components, setOpen);
      ref._CleanBackdropEvent = jest.fn(() => {});
      ref._cleanSelectEvent = jest.fn(() => {});
      return ref;
    };
    const ins = getIns({
      options: {
        moreButtonPlugin_iconComponent,
      },
    });
    const Button = memo(
      ButtonComponent.bind(null, () => ({
        Popper: (props) => (
          <div id="popperID" {...props}>
            mock popper
          </div>
        ),
        Api: api,
        components,
        ctx: ins,
      })),
    );

    act(() => {
      render(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
        container,
      );
    });
    expect(ref._CleanBackdropEvent.mock.calls.length).toBe(0);
    expect(ref._cleanSelectEvent.mock.calls.length).toBe(0);
    act(() => {
      unmountComponentAtNode(container);
    });
    expect(ref._CleanBackdropEvent.mock.calls.length).toBe(1);
    expect(ref._cleanSelectEvent.mock.calls.length).toBe(1);
  });
});
describe('TABS COMPONENT:', () => {
  test('ltr:', () => {
    let buttonApi;
    const api = function (components, setOpen) {
      buttonApi = (Api.default || Api).call(this, components, setOpen);
      return buttonApi;
    };
    const ins = getIns({
      options: {
        moreButtonPlugin_iconComponent,
        selectedTabID: '1',
        tabs: [
          {id: '1', title: 'tab1', panelComponent: <p>tab content 1</p>},
          {id: '2', title: 'tab2', panelComponent: <p>tab content 2</p>},
        ],
      },
    });
    const Button = memo(
      ButtonComponent.bind(null, () => ({
        Popper: (props) => (
          <div id="popperID" {...props}>
            mock popper
          </div>
        ),
        Api: api,
        ctx: ins,
        components,
      })),
    );
    act(() => {
      render(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
        container,
      );
    });
    const TabsComponent = buttonApi._getTabsComponent();
    const tree = renderer
      .create(
        <ApiContext.Provider value={ins}>
          <StateContext.Provider value={{selectedTabID: '1', openTabIDs: ['1', '2']}}>
            <TabsComponent selectedTabID="1" openTabIDs={['1', '2']} dir="ltr" isVertical={true} />
          </StateContext.Provider>
        </ApiContext.Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('rtl:', () => {
    let buttonApi;
    const api = function (components, setOpen) {
      buttonApi = (Api.default || Api).call(this, components, setOpen);
      return buttonApi;
    };
    const ins = getIns({
      options: {
        moreButtonPlugin_iconComponent,
        selectedTabID: '1',
        tabs: [
          {id: '1', title: 'tab1', panelComponent: <p>tab content 1</p>},
          {id: '2', title: 'tab2', panelComponent: <p>tab content 2</p>},
        ],
      },
    });
    const Button = memo(
      ButtonComponent.bind(null, () => ({
        Popper: (props) => (
          <div id="popperID" {...props}>
            mock popper
          </div>
        ),
        Api: api,
        ctx: ins,
        components,
      })),
    );
    act(() => {
      render(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={userProxy} />
        </div>,
        container,
      );
    });
    const TabsComponent = buttonApi._getTabsComponent();
    const tree = renderer
      .create(
        <ApiContext.Provider value={ins}>
          <StateContext.Provider value={{selectedTabID: '1', openTabIDs: ['1', '2']}}>
            <TabsComponent selectedTabID="1" openTabIDs={['1', '2']} dir="rtl" isVertical={true} />
          </StateContext.Provider>
        </ApiContext.Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('trun off accesibility:', () => {
    let buttonApi;
    const api = function (components, setOpen) {
      buttonApi = (Api.default || Api).call(this, components, setOpen);
      return buttonApi;
    };
    const ins = getIns({
      options: {
        moreButtonPlugin_iconComponent,
        selectedTabID: '1',
        accessibility: false,
        tabs: [
          {id: '1', title: 'tab1', panelComponent: <p>tab content 1</p>},
          {id: '2', title: 'tab2', panelComponent: <p>tab content 2</p>},
        ],
      },
    });
    const Button = memo(
      ButtonComponent.bind(null, () => ({
        Popper: (props) => (
          <div id="popperID" {...props}>
            mock popper
          </div>
        ),
        Api: api,
        ctx: ins,
        components,
      })),
    );
    act(() => {
      render(
        <div>
          <Button hiddenTabIDs={'1,2'} instance={ins.userProxy} />
        </div>,
        container,
      );
    });
    const TabsComponent = buttonApi._getTabsComponent();
    const tree = renderer
      .create(
        <ApiContext.Provider value={ins}>
          <StateContext.Provider value={{selectedTabID: '1', openTabIDs: ['1', '2']}}>
            <TabsComponent selectedTabID="1" openTabIDs={['1', '2']} dir="ltr" isVertical={true} />
          </StateContext.Provider>
        </ApiContext.Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
