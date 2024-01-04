import React from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
function TabList(deps, props, ref) {
  const {openTabIDs, selectedTabID} = React.useContext(StateContext);
  const {Tabs, tablistPropsGenerator} = deps(React.useContext(ApiContext), ref, openTabIDs, selectedTabID);
  return <Tabs {...tablistPropsGenerator()} />;
}
export default TabList;
