import React from 'react';
import {ApiContext, ForceUpdateContext} from '../utils/context.js';
import PropTypes from 'prop-types';
const TabComponent = function TabComponent(deps, props) {
  React.useContext(ForceUpdateContext);
  const {tabPropsGenerator, tabInnerPropsGenerator, closeIconPropsGenerator} = deps();
  const {id, selectedTabID} = props,
    api = React.useContext(ApiContext),
    TabInnerComponent = api.getOption('tabComponent'),
    tabObj = api.getTab(id),
    isSelected = selectedTabID === id,
    clkHandler = function (e) {
      api.eventHandlerFactory({e, id});
    };
  return (
    <li
      {...tabPropsGenerator(api, props)}
      onClick={(e) => {
        clkHandler(e);
      }}>
      <TabInnerComponent {...tabInnerPropsGenerator(api, props)}>{tabObj.title}</TabInnerComponent>
      {tabObj.closable ? <span {...closeIconPropsGenerator(api)}>&times;</span> : null}
    </li>
  );
};
TabComponent.propTypes /* remove-proptypes */ = {
  id: PropTypes.string,
  selectedTabID: PropTypes.string,
};
export default TabComponent;
