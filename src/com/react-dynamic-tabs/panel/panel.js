import React, { useContext, memo } from 'react';
import './index.css';
import { ApiContext, ForceUpdateContext } from '../utils/context.js';
import helper from '../utils/helper';
const Panel = memo(function Panel(props) {
    React.useContext(ForceUpdateContext);
    const { id, selectedTabID } = props
        , api = useContext(ApiContext)
        , { cssClasses: { panel, selected } } = api.getSetting()
        , dependedOnIsSelected = {
            panelClass: panel,
            ariaHidden: true
        };
    selectedTabID === id && Object.assign(dependedOnIsSelected, {
        panelClass: panel + ' ' + selected,
        ariaHidden: false
    });
    return (
        <div id={helper.idTemplate.panel(id)} className={dependedOnIsSelected.panelClass}
            aria-labelledby={helper.idTemplate.ariaLabelledby(id)} role='tabpanel'
            aria-hidden={dependedOnIsSelected.ariaHidden}>
            {api.getPanel(id)}
        </div>
    )
}, (oldProps, newProps) => {
    const { id, selectedTabID: oldActiveId } = oldProps, { selectedTabID: newActiveId } = newProps;
    return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
});
export default Panel;
