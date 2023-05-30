import React from 'react';
import ShowMoreTabs from './show-more-tabs/index.js';
export default function ResponsiveFactory(ctx, useScroll = false) {
  ctx.optionsManager.setting.Slider = function (props) {
    return <div>{props.children}</div>;
  };
  ctx.optionsManager.setting.ShowMoreButton = function (props) {
    return (
      <ShowMoreTabs {...props} ctx={ctx}>
        {props.children}
      </ShowMoreTabs>
    );
  };
}
