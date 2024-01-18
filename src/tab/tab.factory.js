import React from 'react';
import {ApiContext, ForceUpdateContext} from '../utils/context.js';
import PropTypes from 'prop-types';
const TabComponent = function TabComponent(deps, props) {
  React.useContext(ForceUpdateContext);
  const api = React.useContext(ApiContext);
  const {tabPropsManager, tabInnerPropsManager, closeIconPropsManager} = deps(api);
  const {id, selectedTabID} = props,
    TabInnerComponent = api.getOption('tabComponent'),
    tabObj = api.getTab(id),
    clkHandler = function (e) {
      api.eventHandlerFactory({e, id});
    };
  return (
    <li
      {...tabPropsManager(props)}
      onClick={(e) => {
        clkHandler(e);
      }}>
      <TabInnerComponent {...tabInnerPropsManager(props)}>{tabObj.title}</TabInnerComponent>
      {tabObj.closable ? <span {...closeIconPropsManager()}>&times;</span> : null}
    </li>
  );
};
TabComponent.propTypes /* remove-proptypes */ = {
  id: PropTypes.string,
  selectedTabID: PropTypes.string,
};
export default TabComponent;
