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
    previousSelectedTabID = api.state.selectedTabID,
    {panelComponent: PanelComponent, lazy} = api.getTab(id);
  let hasBeenSelected = false;
  if (!lazy || isSelected || previousSelectedTabID === id || api.activedTabsHistory.tabsId.indexOf(id) >= 0) {
    hasBeenSelected = true;
  }
  return (
    <div {...panelProps}>
      {hasBeenSelected ? (
        PanelComponent ? (
          <PanelComponent id={id} isSelected={isSelected} api={api.userProxy}></PanelComponent>
        ) : null
      ) : null}
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
