import React from 'react';
import ShowMoreTabs from './show-more-tabs/index.js';
export default function ResponsiveFactory(ctx) {
  const {setting} = ctx.optionsManager;
  setting.SliderContainer = function (props) {
    return (
      <div style={{overflow: 'visible'}} className={setting.sliderContainerClass}>
        {props.children}
      </div>
    );
  };
  setting.ShowMoreButton = function (props) {
    return (
      <ShowMoreTabs {...props} ctx={ctx}>
        {props.children}
      </ShowMoreTabs>
    );
  };
  //override overflow plugin
  setting.ScrollContainer = function (props) {
    return <>{props.children}</>;
  };
}
