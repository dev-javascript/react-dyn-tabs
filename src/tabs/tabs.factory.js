import React from 'react';
import {ApiContext} from '../utils/context.js';
import PropTypes from 'prop-types';
function TabsComponent(deps, props, ref) {
  const {openTabIDs, selectedTabID, dir, isVertical} = props;
  const {TabsPropsManager, Tab} = deps(React.useContext(ApiContext));
  return (
    <ul {...TabsPropsManager({dir, isVertical})} ref={ref || null}>
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
};
