import React, {memo, useEffect} from 'react';
import {ApiContext, ForceUpdateContext} from '../utils/context.js';
import TabPropsManager from './tabPropsManager.js';
import PropTypes from 'prop-types';
const TabComponent = function TabComponent(props) {
  React.useContext(ForceUpdateContext);
  const {id, selectedTabID} = props,
    api = React.useContext(ApiContext),
    TabInnerComponent = api.getOption('tabComponent'),
    {closable, title} = api.getTab(id),
    propsManager = new TabPropsManager({api, id, isSelected: selectedTabID === id}),
    clkHandler = function (e) {
      api.eventHandlerFactory({e, id});
    };
  useEffect(() => {
    api.trigger('_onTabMount', api.userProxy, () => [props.id]);
  }, []);
  return (
    <li
      {...propsManager.getTabProps()}
      onClick={(e) => {
        clkHandler(e);
      }}>
      <TabInnerComponent {...propsManager.getTabInnerProps()}>{title}</TabInnerComponent>
      {closable ? <span {...propsManager.getCloseIconProps()}>&times;</span> : null}
    </li>
  );
};
TabComponent.propTypes /* remove-proptypes */ = {
  id: PropTypes.string,
  selectedTabID: PropTypes.string,
};
const Tab = memo(TabComponent, (oldProps, newProps) => {
  const {id, selectedTabID: oldActiveId} = oldProps,
    {selectedTabID: newActiveId} = newProps;
  return oldActiveId === newActiveId || (id !== oldActiveId && id !== newActiveId);
});
export default Tab;
