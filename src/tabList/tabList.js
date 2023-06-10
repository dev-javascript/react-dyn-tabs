import React, {memo, forwardRef} from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';
const TabList = memo(
  forwardRef(function TabList(props, ref) {
    const {openTabIDs, selectedTabID} = React.useContext(StateContext);
    const api = React.useContext(ApiContext);
    const {direction, isVertical} = api.optionsManager.options;
    return (
      <Tabs openTabIDs={openTabIDs} selectedTabID={selectedTabID} ref={ref} dir={direction} isVertical={isVertical} />
    );
  }),
  () => true,
);
export const Tabs = forwardRef(function Tabs(props, ref) {
  const {openTabIDs, selectedTabID, dir, isVertical} = props;
  const api = React.useContext(ApiContext);
  const tablistProps = tablistPropsManager({api, dir, isVertical});
  return (
    <ul {...tablistProps} ref={ref || null}>
      {openTabIDs.map((id) => (
        <Tab key={id} id={id} selectedTabID={selectedTabID}></Tab>
      ))}
    </ul>
  );
});
export default TabList;
