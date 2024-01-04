import React from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
function TabList(deps, props, ref) {
  const state = React.useContext(StateContext);
  const {Tabs, tablistPropsGenerator} = deps(React.useContext(ApiContext), ref, state);
  return <Tabs {...tablistPropsGenerator()} />;
}
export default TabList;
