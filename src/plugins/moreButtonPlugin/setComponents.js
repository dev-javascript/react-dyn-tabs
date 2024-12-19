import React, {memo} from 'react';
import PropTypes from 'prop-types';
export default function setComponents(deps, ctx, components) {
  const {moreButtonPlugin_buttonComponent, ShowMoreTabs, moreButtonPlugin_iconComponent} = deps;
  setComponents.setSetting(ctx);
  setComponents.setDefaultOptions(ctx, components, moreButtonPlugin_buttonComponent, moreButtonPlugin_iconComponent);
  setComponents.setTablistView(components);
  setComponents.setMoreButtonPlugin(ctx, components, ShowMoreTabs, setComponents.ShowMoreButton, memo);
  setComponents.setTablistOverflow(components);
}
export const ShowMoreButton = (setComponents.ShowMoreButton = function ShowMoreButton(deps, props) {
  const {
    ShowMoreTabs,
    components: {useForceUpdate, useRootState},
  } = deps;
  useForceUpdate();
  const {openTabIDs, selectedTabID} = useRootState();
  return (
    <ShowMoreTabs {...props} ctx={deps.ctx} openTabIDs={openTabIDs} selectedTabID={selectedTabID}>
      {props.children /* eslint-disable-line react/prop-types */}
    </ShowMoreTabs>
  );
});
ShowMoreButton.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
  openTabIDs: PropTypes.array,
  selectedTabID: PropTypes.string,
};
export const setMoreButtonPlugin = (setComponents.setMoreButtonPlugin = function (
  ctx,
  components,
  ShowMoreTabs,
  ShowMoreButton,
  memo,
) {
  components.MoreButtonPlugin = memo(ShowMoreButton.bind(undefined, {ctx, components, ShowMoreTabs}), () => true);
});
export const setTablistOverflow = (setComponents.setTablistOverflow = function (components) {
  if (!components.OriginalTablistOverflow) {
    components.OriginalTablistOverflow = components.TablistOverflow;
    components.TablistOverflow = function TablistOverflow(props) {
      return (
        <components.OriginalTablistOverflow {...props}>
          {props.children /* eslint-disable-line react/prop-types */}
          <components.MoreButtonPlugin />
        </components.OriginalTablistOverflow>
      );
    };
  }
});
export const setTablistView = (setComponents.setTablistView = function (components) {
  components.TablistView = components.TablistViewFactory.bind(undefined, (ins) => ({
    tablistViewPropsManager: () => {
      const attrs = components.tablistViewPropsManager(ins);
      attrs.className += ' rc-dyn-tabs-responsive';
      return attrs;
    },
  }));
});
export const setDefaultOptions = (setComponents.setDefaultOptions = function (
  ctx,
  components,
  moreButtonPlugin_buttonComponent,
  moreButtonPlugin_iconComponent,
) {
  ctx.optionsManager.options = Object.assign(
    {
      moreButtonPlugin_buttonComponent: moreButtonPlugin_buttonComponent({ctx, components}),
      moreButtonPlugin_iconComponent,
      moreButtonPlugin_buttonTooltip: 'show more',
    },
    ctx.optionsManager.options,
  );
});
export const setSetting = (setComponents.setSetting = function (ctx) {
  ctx.optionsManager.setting.showMoreContainerClass = 'rc-dyn-tabs-showmorebutton-container';
  ctx.optionsManager.setting.showMoreButtonClass = 'rc-dyn-tabs-showmorebutton';
  ctx.optionsManager.setting.showMorePopperClass = 'rc-dyn-tabs-popper';
});
