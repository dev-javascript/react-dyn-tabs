import React, { useContext, memo, useEffect, useRef } from 'react';
import './index.css';
import { ApiContext, StateContext } from '../utils/context.js';
const Panel = memo(function Panel(props) {
    const { id } = props;
    const { activeTabId } = useContext(StateContext), isActive = activeTabId === id;
    const api = useContext(ApiContext);
    const { classNames: { panel: defaultClass, activePanel: activeClass } } = api.getMutableCurrentOptions();

    const counter = useRef(0);
    counter.current++;

    useEffect(() => api.panelDidMount({ panelId: id, isActive }), [id]);
    useEffect(() => api.panelDidUpdate({ panelId: id, isActive, counter: counter.current }), [activeTabId]);

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
