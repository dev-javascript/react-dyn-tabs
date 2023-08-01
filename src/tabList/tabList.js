import React, {memo, forwardRef} from 'react';
import {ApiContext, StateContext} from '../utils/context.js';
import Tab from '../tab/tab.js';
import tablistPropsManager from './tablistPropsManager.js';
import PropTypes from 'prop-types';
function TabsComponent(props, ref) {
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
}
TabsComponent.propTypes /* remove-proptypes */ = {
  selectedTabID: PropTypes.string,
  dir: PropTypes.string,
  isVertical: PropTypes.bool,
  openTabIDs: PropTypes.array,
};
const MemomizedTabList = memo(forwardRef(TabList), () => true);
function TabList(props, ref) {
  const {openTabIDs, selectedTabID} = React.useContext(StateContext);
  const api = React.useContext(ApiContext);
  const {direction, isVertical} = api.optionsManager.options;
  return (
    <Tabs openTabIDs={openTabIDs} selectedTabID={selectedTabID} ref={ref} dir={direction} isVertical={isVertical} />
  );
}
export const Tabs = forwardRef(TabsComponent);
export default MemomizedTabList;
