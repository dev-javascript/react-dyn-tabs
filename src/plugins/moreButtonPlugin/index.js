import React from 'react';
import ShowMoreTabs from './show-more-tabs/index.js';
import PropTypes from 'prop-types';

function ShowMoreButton(deps, props) {
  return (
    <ShowMoreTabs {...props} ctx={deps.ctx} components={deps.components}>
      {props.children}
    </ShowMoreTabs>
  );
}
ShowMoreButton.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
export default function ResponsiveFactory(ctx, components) {
  const {setting} = ctx.optionsManager;
  setting.responsiveClass = 'rc-dyn-tabs-responsive';
  const MoreButtonPlugin = ShowMoreButton.bind(undefined, {ctx, components});
  if (!components.OriginalTablistOverflow) {
    components.OriginalTablistOverflow = components.TablistOverflow;
    components.TablistOverflow = function (props) {
      return (
        <components.OriginalTablistOverflow {...props}>
          {props.children}
          <MoreButtonPlugin />
        </components.OriginalTablistOverflow>
      );
    };
  }
}
