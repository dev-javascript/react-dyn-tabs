import React from 'react';
import ShowMoreTabs from './show-more-tabs/index.js';
export default function ResponsiveFactory(ctx, contexts, TabsComponent) {
  const {setting, internalOptions} = ctx.optionsManager;
  internalOptions.TablistOverflow = function (props) {
    return (
      <div style={{overflow: 'visible'}} className={setting.tablistOverflowClass}>
        {props.children}
      </div>
    );
  };
  internalOptions.ShowMoreButton = function (props) {
    return (
      <ShowMoreTabs {...props} ctx={ctx} contexts={contexts} TabsComponent={TabsComponent}>
        {props.children}
      </ShowMoreTabs>
    );
  };
}
