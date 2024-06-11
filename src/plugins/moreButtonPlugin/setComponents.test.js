/* eslint-disable react/prop-types */
import React from 'react';
import renderer from 'react-test-renderer';
import showMorePlugin, {
  ShowMoreButton,
  setMoreButtonPlugin,
  setTablistOverflow,
  setTablistView,
  setDefaultOptions,
  setSetting,
} from './setComponents.js';
beforeAll(() => {});
beforeEach(() => {});
afterEach(() => {});
afterAll(() => {
  showMorePlugin.ShowMoreButton = ShowMoreButton;
  showMorePlugin.setMoreButtonPlugin = setMoreButtonPlugin;
  showMorePlugin.setTablistOverflow = setTablistOverflow;
  showMorePlugin.setTablistView = setTablistView;
  showMorePlugin.setDefaultOptions = setDefaultOptions;
});
describe('showMorePlugin ', () => {
  test('MoreButtonPlugin : ', () => {
    const ctx = {};
    const components = {useForceUpdate: () => {}, useRootState: () => ({openTabIDs: ['1', '2'], selectedTabID: '1'})};
    const ShowMoreTabs = (props) => <div {...props}>{props.children}</div>;
    const memo = jest.fn((fn) => fn);
    setMoreButtonPlugin(ctx, components, ShowMoreTabs, ShowMoreButton, memo);
    const Com = <components.MoreButtonPlugin customProp="customProp">button children</components.MoreButtonPlugin>;
    const tree = renderer.create(Com).toJSON();
    expect(tree).toMatchSnapshot();
    expect(memo.mock.calls.length).toBe(1);
    expect(typeof memo.mock.calls[0][0]).toBe('function');
    expect(memo.mock.calls[0][1]()).toBe(true);
  });
  test('setTablistOverflow only works if the OriginalTablistOverflow property is not existed : ', () => {
    const components = {TablistOverflow: '', OriginalTablistOverflow: 1};
    setTablistOverflow(components);
    expect(components.TablistOverflow).toBe('');
  });
  test('TablistOverflow : ', () => {
    const TablistOverflow = (props) => (
      <div id="TablistOverflow" {...props}>
        {props.children}
      </div>
    );
    const MoreButtonPlugin = () => <div id="MoreButtonPlugin"></div>;
    const components = {TablistOverflow, MoreButtonPlugin};
    setTablistOverflow(components);
    const Com = <components.TablistOverflow customProp="customProp">tablist</components.TablistOverflow>;
    const tree = renderer.create(Com).toJSON();
    expect(tree).toMatchSnapshot();
    expect(components.OriginalTablistOverflow).toEqual(TablistOverflow);
  });
  test('TablistView : ', () => {
    const components = {
      tablistViewPropsManager: () => ({className: ''}),
      TablistViewFactory: (getDeps, props) => {
        const {tablistViewPropsManager} = getDeps();
        return <div {...tablistViewPropsManager()}>{props.children}</div>;
      },
    };
    setTablistView(components);
    const Com = <components.TablistView>tablist view children</components.TablistView>;
    const tree = renderer.create(Com).toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('setDefaultOptions : ', () => {
    const ctx = {
      optionsManager: {
        options: {},
      },
    };
    const components = {};
    const moreButtonPlugin_buttonComponent = jest.fn((obj) =>
      obj.components && obj.ctx ? 'moreButtonPlugin_buttonComponent' : '',
    );
    const moreButtonPlugin_iconComponent = 'moreButtonPlugin_iconComponent';
    setDefaultOptions(ctx, components, moreButtonPlugin_buttonComponent, moreButtonPlugin_iconComponent);
    expect(ctx.optionsManager.options.moreButtonPlugin_iconComponent).toBe('moreButtonPlugin_iconComponent');
    expect(ctx.optionsManager.options.moreButtonPlugin_buttonComponent).toBe('moreButtonPlugin_buttonComponent');
    expect(ctx.optionsManager.options.moreButtonPlugin_buttonTooltip).toBe('show more');
    expect(moreButtonPlugin_buttonComponent.mock.calls.length).toBe(1);
    expect(moreButtonPlugin_buttonComponent.mock.calls[0][0]).toEqual({ctx, components});
  });
  test('setSetting : ', () => {
    const ctx = {
      optionsManager: {
        setting: {},
      },
    };
    setSetting(ctx);
    expect(ctx.optionsManager.setting.showMoreContainerClass).toBe('rc-dyn-tabs-showmorebutton-container');
    expect(ctx.optionsManager.setting.showMoreButtonClass).toBe('rc-dyn-tabs-showmorebutton');
    expect(ctx.optionsManager.setting.showMorePopperClass).toBe('rc-dyn-tabs-popper');
  });
  test('constructor : ', () => {
    showMorePlugin.ShowMoreButton = jest.fn(() => {});
    showMorePlugin.setMoreButtonPlugin = jest.fn(() => {});
    showMorePlugin.setTablistOverflow = jest.fn(() => {});
    showMorePlugin.setTablistView = jest.fn(() => {});
    showMorePlugin.setDefaultOptions = jest.fn(() => {});
    showMorePlugin.setSetting = jest.fn(() => {});
    const deps = {
      moreButtonPlugin_buttonComponent: 'moreButtonPlugin_buttonComponent',
      ShowMoreTabs: 'ShowMoreTabs',
      moreButtonPlugin_iconComponent: 'moreButtonPlugin_iconComponent',
    };
    const ctx = {};
    const components = {};
    showMorePlugin(deps, ctx, components);
    expect(showMorePlugin.setSetting.mock.calls.length).toBe(1);
    expect(showMorePlugin.setDefaultOptions.mock.calls.length).toBe(1);
    expect(showMorePlugin.setTablistView.mock.calls.length).toBe(1);
    expect(showMorePlugin.setMoreButtonPlugin.mock.calls.length).toBe(1);
    expect(showMorePlugin.setTablistOverflow.mock.calls.length).toBe(1);
    expect(showMorePlugin.setSetting).toHaveBeenCalledBefore(showMorePlugin.setDefaultOptions);
    expect(showMorePlugin.setDefaultOptions).toHaveBeenCalledBefore(showMorePlugin.setTablistView);
    expect(showMorePlugin.setTablistView).toHaveBeenCalledBefore(showMorePlugin.setMoreButtonPlugin);
    expect(showMorePlugin.setMoreButtonPlugin).toHaveBeenCalledBefore(showMorePlugin.setTablistOverflow);
    expect(showMorePlugin.setMoreButtonPlugin.mock.calls[0][3]).toEqual(showMorePlugin.ShowMoreButton);
  });
});
