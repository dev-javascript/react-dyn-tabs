import React from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
function TabList(deps, props, ref) {
  const {Tabs} = deps();
  const {openTabIDs, selectedTabID} = React.useContext(StateContext);
  const api = React.useContext(ApiContext);
  const {direction, isVertical} = api.optionsManager.options;
  return (
    <Tabs openTabIDs={openTabIDs} selectedTabID={selectedTabID} ref={ref} dir={direction} isVertical={isVertical} />
  );
}
export default TabList;
