import React, { useContext, memo, useEffect } from 'react';
import './index.css';
import { ApiContext, StateContext } from '../utils/context.js';
const Panel = memo(function Panel(props) {
    const { id } = props;
    const { activeTabId } = useContext(StateContext);
    const api = useContext(ApiContext);
    const { classNames: { panel: defaultClass, activePanel: activeClass } } = api.getMutableCurrentOptions();

    useEffect(() => {
        if (activeTabId == id) {
            const stackEvents = api.stackedEvent.afterActivePanel;
            while (stackEvents.length) {
                const resolve = stackEvents.pop();
                resolve(`panel_${id}`);
            }
        }
    });

    return (
        <div
            id={`panel_${id}`}
            className={`nestedTab_panel${defaultClass}${activeTabId == id ? ` active${activeClass}` : ''}`}
        >
            {api.renderedComponent.getById(id)}
        </div>
    )
}, () => true);
export default Panel;
