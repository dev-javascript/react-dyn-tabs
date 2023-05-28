import React, {memo, forwardRef} from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';
const TabList = memo(
  forwardRef(function TabList(props, ref) {
    const {openTabIDs, selectedTabID} = React.useContext(StateContext),
      api = React.useContext(ApiContext),
      tablistProps = tablistPropsManager({api});
    return (
      <ul {...tablistProps} ref={ref || null}>
        {openTabIDs.map((id) => (
          <Tab key={id} id={id} selectedTabID={selectedTabID}></Tab>
        ))}
      </ul>
    );
  }),
  () => true,
);
export default TabList;
