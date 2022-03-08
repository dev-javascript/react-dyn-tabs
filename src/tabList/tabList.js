import React, {memo} from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';
const TabList = React.forwardRef((props, ref) => {
  const {openTabIDs, selectedTabID} = React.useContext(StateContext),
    api = React.useContext(ApiContext),
    tablistProps = tablistPropsManager({api});
  return (
    <ul ref={ref} {...tablistProps}>
      {api.optionsManager.setting.getRenderableTabs(openTabIDs).map((id) => (
        <Tab key={id} id={id} selectedTabID={selectedTabID}></Tab>
      ))}
    </ul>
  );
});
export default memo(TabList, () => true);
