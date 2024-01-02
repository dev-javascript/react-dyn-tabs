import React from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
function TabList(deps, props, ref) {
  const {openTabIDs, selectedTabID} = React.useContext(StateContext);
  const {Tabs, getTablistProps} = deps(React.useContext(ApiContext), ref, openTabIDs, selectedTabID);
  return <Tabs {...getTablistProps()} />;
}
export default TabList;
