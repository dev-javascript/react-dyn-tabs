import React, { memo } from 'react';
import './index.css';
import Panel from '../panel/panel.js';
import { ApiContext, StateContext } from '../utils/context.js';
const PanelList = memo(function PanelList(props) {
    const { openTabIDs, selectedTabID } = React.useContext(StateContext)
        , api = React.useContext(ApiContext)
        , { cssClasses, cssClasses: { panellist } } = api.getSetting()
        , className = panellist + ' ' + cssClasses[api.getOptions().direction];
    return (
        <div className={className}>
            {openTabIDs.map(id =>
                <Panel key={id} id={id} selectedTabID={selectedTabID}></Panel>
            )}
        </div>
    )
}, () => true);

export default PanelList;