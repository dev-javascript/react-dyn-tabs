import React, { memo } from 'react';
import './index.css';
import Panel from '../panel/panel.js';
import { ApiContext, StateContext } from '../utils/context.js';
const PanelList = memo(function PanelList(props) {
    const { openTabsId, activeTabId } = React.useContext(StateContext)
        , api = React.useContext(ApiContext)
        , { cssClasses, cssClasses: { panellist } } = api.getSetting()
        , className = panellist + ' ' + cssClasses[api.getOptions().direction];
    return (
        <div className={className}>
            {openTabsId.map(id =>
                <Panel key={id} id={id} activeTabId={activeTabId}></Panel>
            )}
        </div>
    )
}, () => true);

export default PanelList;