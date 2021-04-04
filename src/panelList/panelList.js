import React, { memo } from 'react';
import './index.css';
import Panel from '../panel/panel.js';
import { ApiContext, StateContext } from '../utils/context.js';
const PanelList = memo(function PanelList(props) {
    const { openTabIDs, selectedTabID } = React.useContext(StateContext)
        , api = React.useContext(ApiContext)
        , setting = api.optionsManager.setting
        , className = setting.panellistClass + ' ' + setting[api.getOption('direction') + 'class'];
    return (
        <div className={className}>
            {openTabIDs.map(id =>
                <Panel key={id} id={id} selectedTabID={selectedTabID}></Panel>
            )}
        </div>
    )
}, () => true);

export default PanelList;