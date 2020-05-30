import React, { useContext, memo, useEffect, useRef } from 'react';
import './index.css';
import { ApiContext } from '../utils/context.js';
import useCounter from '../utils/useCounter';
import idTemplate from '../utils/idTemplate';
const Panel = memo(function Panel(props) {
    const [isFirstCall] = useCounter()
        , { id, activeTabId } = props
        , isActive = activeTabId === id
        , api = useContext(ApiContext)
        , { classNames: { panel: defaultClass, activePanel: activeClass } } = api.getMutableCurrentOptions()
        , panelClass = isActive ? (defaultClass + ' ' + activeClass) : defaultClass;

    useEffect(() => {
        api.panelDidMount({ id, isActive });
        return () => {
            api.panelWillUnmount({ id, isActive });
        }
    }, [id]);
    useEffect(() => api.panelDidUpdate({ id, isActive, isFirstCall }), [activeTabId]);

    return (
        <div
            id={idTemplate.panel(id)}
            className={panelClass}
        >
            {api.renderedComponent.getById(id)}
        </div>
    )
}, (oldProps, newProps) => {
    const { id, activeTabId: oldActiveId } = oldProps, { activeTabId: newActiveId } = newProps;
    return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
});
export default Panel;
