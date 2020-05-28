import React, { useContext, memo, useEffect, useRef } from 'react';
import './index.css';
import { ApiContext, StateContext } from '../utils/context.js';
import useConter from '../utils/useCounter';
const Panel = memo(function Panel(props) {
    const [isFirstCall] = useCounter();
    const { id } = props;
    const { activeTabId } = useContext(StateContext), isActive = activeTabId === id;
    const api = useContext(ApiContext);
    const { classNames: { panel: defaultClass, activePanel: activeClass } } = api.getMutableCurrentOptions();

    useEffect(() => api.panelDidMount({ panelId: id, isActive }), [id]);
    useEffect(() => api.panelDidUpdate({ panelId: id, isActive, isFirstCall }), [activeTabId]);

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
