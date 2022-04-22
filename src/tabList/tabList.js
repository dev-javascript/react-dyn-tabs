import React, {memo} from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';
const TabList = React.forwardRef((props, ref) => {
  const {openTabIDs, selectedTabID} = React.useContext(StateContext),
    api = React.useContext(ApiContext),
    {MoreButtonComponent} = api.optionsManager.setting,
    {tablistRootProps, tablistSectionProps, tablistSliderProps, tablistProps} = tablistPropsManager(api);
  return (
    <div {...tablistRootProps}>
      <div {...tablistSectionProps}>
        <div {...tablistSliderProps}>
          <ul ref={ref} {...tablistProps}>
            {api.optionsManager.setting.getRenderableTabs(openTabIDs).map((id) => (
              <Tab key={id} id={id} selectedTabID={selectedTabID}></Tab>
            ))}
          </ul>
          <MoreButtonComponent />
        </div>
      </div>
    </div>
  );
});
export default memo(TabList, () => true);
