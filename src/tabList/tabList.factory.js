import React from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
function TabList(deps, props, ref) {
  const state = React.useContext(StateContext);
  const {Tabs, tablistPropsManager} = deps(React.useContext(ApiContext));
  return <Tabs {...tablistPropsManager(ref, state)} />;
}
export default TabList;
