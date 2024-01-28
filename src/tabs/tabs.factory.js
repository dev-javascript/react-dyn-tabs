import React from 'react';
import {ApiContext} from '../context.js';
import PropTypes from 'prop-types';
function TabsComponent(deps, props, ref) {
  const {openTabIDs, selectedTabID} = props;
  const {TabsPropsManager, Tab} = deps(React.useContext(ApiContext));
  return (
    <ul {...TabsPropsManager(props)} ref={ref || null}>
      {openTabIDs.map((id) => (
        <Tab key={id} id={id} selectedTabID={selectedTabID}></Tab>
      ))}
    </ul>
  );
}
export default TabsComponent;
TabsComponent.propTypes /* remove-proptypes */ = {
  selectedTabID: PropTypes.string,
  dir: PropTypes.string,
  isVertical: PropTypes.bool,
  openTabIDs: PropTypes.array,
  tablistID: PropTypes.string,
};
