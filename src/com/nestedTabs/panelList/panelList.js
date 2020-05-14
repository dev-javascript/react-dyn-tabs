import React, { useContext, memo } from 'react';
import './index.css';
import Panel from '../panel/panel.js';
import { ApiContext, StateContext } from '../utils/context.js';

const PanelList = memo(function PanelList(props) {
    const { openTabsId } = useContext(StateContext);
    const { classNames: { panelList: defaultClass } } = useContext(ApiContext).getMutableCurrentOptions();
    return (
        <div className={`nestedTab_panelList${defaultClass}`}>
            {openTabsId.map(id =>
                <Panel key={id} id={id}></Panel>
            )}
        </div>
    )
}, () => true);

export default PanelList;