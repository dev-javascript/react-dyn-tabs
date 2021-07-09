import React, {memo} from 'react';
import Panel from '../panel/panel.js';
import {ApiContext, StateContext} from '../utils/context.js';
const PanelList = memo(
  function PanelList() {
    const {openTabIDs, selectedTabID} = React.useContext(StateContext),
      api = React.useContext(ApiContext),
      setting = api.optionsManager.setting,
      options = api.optionsManager.options;
    let className = setting.panellistClass + ' ' + setting[options.direction + 'Class'];
    if (options.isVertical) {
      className += ' ' + setting.verticalClass;
    }
    return (
      <div className={className}>
        {openTabIDs.map((id) => (
          <Panel key={id} id={id} selectedTabID={selectedTabID}></Panel>
        ))}
      </div>
    );
  },
  () => true,
);

export default PanelList;
