import React, {memo} from 'react';
import ShowMoreTabs from './show-more-tabs/index.js';
import moreButtonPlugin_buttonComponent from './button/index.js';
import moreButtonPlugin_iconComponent from './icon.js';
import PropTypes from 'prop-types';
function ShowMoreButton(deps, props) {
  const {useForceUpdate, useRootState} = deps.components;
  useForceUpdate();
  const {openTabIDs, selectedTabID} = useRootState();
  return (
    <ShowMoreTabs {...props} ctx={deps.ctx} openTabIDs={openTabIDs} selectedTabID={selectedTabID}>
      {props.children}
    </ShowMoreTabs>
  );
}
ShowMoreButton.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
  openTabIDs: PropTypes.array,
  selectedTabID: PropTypes.string,
};
function setTablistOverflow(ctx, components) {
  components.MoreButtonPlugin = memo(ShowMoreButton.bind(undefined, {ctx, components}), () => true);
  if (!components.OriginalTablistOverflow) {
    components.OriginalTablistOverflow = components.TablistOverflow;
    components.TablistOverflow = function (props) {
      return (
        <components.OriginalTablistOverflow {...props}>
          {props.children}
          <components.MoreButtonPlugin />
        </components.OriginalTablistOverflow>
      );
    };
  }
}
function setTablistView(ctx, components) {
  components.TablistView = components.TablistViewFactory.bind(undefined, (ins) => ({
    tablistViewPropsManager: () => {
      let {className} = components.tablistViewPropsManager(ins);
      className += ' rc-dyn-tabs-responsive';
      return {className};
    },
  }));
}
function setDefaultOptions(ctx, components) {
  ctx.optionsManager.options = Object.assign(
    {
      moreButtonPlugin_buttonComponent: moreButtonPlugin_buttonComponent({ctx, components}),
      moreButtonPlugin_iconComponent,
      moreButtonPlugin_buttonTooltip: 'show more',
    },
    ctx.optionsManager.options,
  );
}
export default function ResponsiveFactory(ctx, components) {
  setDefaultOptions(ctx, components);
  setTablistView(ctx, components);
  setTablistOverflow(ctx, components);
}
