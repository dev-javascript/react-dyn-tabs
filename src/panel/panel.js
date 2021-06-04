import React, {memo} from 'react';
import {ApiContext, ForceUpdateContext} from '../utils/context.js';
import panelPropsManager from './panelPropsManager.js';
import PropTypes from 'prop-types';
const PanelComponent = function PanelComponent(props) {
  React.useContext(ForceUpdateContext);
  const {id, selectedTabID} = props,
    api = React.useContext(ApiContext),
    isSelected = id === selectedTabID,
    panelProps = panelPropsManager({isSelected, api, id}),
    PanelComponent = api.getTab(id).panelComponent;
  return (
    <div {...panelProps}>
      <PanelComponent id={id} isSelected={isSelected} api={api.userProxy}></PanelComponent>
    </div>
  );
};
PanelComponent.propTypes /* remove-proptypes */ = {
  id: PropTypes.string,
  selectedTabID: PropTypes.string,
};
const Panel = memo(PanelComponent, (oldProps, newProps) => {
  const {id, selectedTabID: oldActiveId} = oldProps,
    {selectedTabID: newActiveId} = newProps;
  return oldActiveId === newActiveId || (id !== oldActiveId && id !== newActiveId);
});
export default Panel;
