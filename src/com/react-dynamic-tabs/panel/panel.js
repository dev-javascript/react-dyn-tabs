import React, { useContext, memo } from 'react';
import './index.css';
import { ApiContext, ForceUpdateContext } from '../utils/context.js';
const Panel = memo(function Panel(props) {
    React.useContext(ForceUpdateContext);
    const { id, selectedTabID } = props
        , api = useContext(ApiContext)
        , { cssClasses: { panel, selected }, keyTemps } = api.getSetting()
        , dependedOnIsSelected = {
            panelClass: panel,
            ariaHidden: true
        };
    selectedTabID === id && Object.assign(dependedOnIsSelected, {
        panelClass: panel + ' ' + selected,
        ariaHidden: false
    });
    return (
        <div id={keyTemps.panel(id)} className={dependedOnIsSelected.panelClass}
            aria-labelledby={keyTemps.ariaLabelledby(id)} role='tabpanel'
            aria-hidden={dependedOnIsSelected.ariaHidden}>
            {api.getPanel(id)}
        </div>
    )
}, (oldProps, newProps) => {
    const { id, selectedTabID: oldActiveId } = oldProps, { selectedTabID: newActiveId } = newProps;
    return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
});
export default Panel;
