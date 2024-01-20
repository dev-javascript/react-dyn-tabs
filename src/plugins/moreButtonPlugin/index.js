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
function setTablistOverflow(ctx, components) {
  components.MoreButtonPlugin = ShowMoreButton.bind(undefined, {ctx, components});
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
export default function ResponsiveFactory(ctx, components) {
  setTablistView(ctx, components);
  setTablistOverflow(ctx, components);
}
