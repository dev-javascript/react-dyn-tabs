import React, { useContext, memo } from 'react';
import './index.css';
import { ApiContext, ForceUpdateContext } from '../utils/context.js';
import panelPropsManager from './panelPropsManager.js';
const Panel = memo(function Panel(props) {
    React.useContext(ForceUpdateContext);
    const { id, selectedTabID } = props
        , api = useContext(ApiContext)
        , panelProps = panelPropsManager.get({ isSelected: id === selectedTabID, api, id });
    return (
        <div {...panelProps}>
            {api.getTab(id).panelComponent}
        </div>
    )
}, (oldProps, newProps) => {
    const { id, selectedTabID: oldActiveId } = oldProps, { selectedTabID: newActiveId } = newProps;
    return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
});
export default Panel;
