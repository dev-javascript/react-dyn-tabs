import React from 'react';
import ShowMoreTabs from './show-more-tabs/index.js';
import PropTypes from 'prop-types';
function TablistOverflow(deps, props) {
  return (
    <div style={{overflow: 'visible'}} className={deps.tablistOverflowClass}>
      {props.children}
    </div>
  );
}
TablistOverflow.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
function ShowMoreButton(deps, props) {
  return (
    <ShowMoreTabs {...props} ctx={deps.ctx} contexts={deps.contexts} TabsComponent={deps.TabsComponent}>
      {props.children}
    </ShowMoreTabs>
  );
}
ShowMoreButton.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
export default function ResponsiveFactory(ctx, contexts, TabsComponent) {
  const {
    setting,
    setting: {tablistOverflowClass},
    internalOptions,
  } = ctx.optionsManager;
  setting.responsiveClass = 'rc-dyn-tabs-responsive';
  internalOptions.TablistOverflow = TablistOverflow.bind(undefined, {tablistOverflowClass});
  internalOptions.ShowMoreButton = ShowMoreButton.bind(undefined, {ctx, contexts, TabsComponent});
}
