import React, { useContext, memo, useEffect, useRef } from 'react';
import './index.css';
import { ApiContext, ForceUpdateContext } from '../utils/context.js';
import { useCounter } from '../utils/helperHooks';
import { idTemplate } from '../utils/helper';
import events from '../utils/events';
const Panel = memo(function Panel(props) {
    React.useContext(ForceUpdateContext);
    const [isFirstCall] = useCounter()
        , { id, activeTabId } = props
        , isActive = activeTabId === id
        , api = useContext(ApiContext)
        , { classNames: { panel: defaultClass, activePanel: activeClass } } = api.getMutableCurrentOptions()
        , panelClass = isActive ? (defaultClass + ' ' + activeClass) : defaultClass;

    useEffect(() => {
        api.observable.publisher.trigger(events.panelDidMount, { id, isActive });
    }, [id]);
    useEffect(() => {
        return () => {
            api.observable.publisher.trigger(events.panelWillUnmount, { id, isActive });
        }
    });
    return (
        <div
            id={idTemplate.panel(id)}
            className={panelClass}
        >
            {api.getPanel(id)}
        </div>
    )
}, (oldProps, newProps) => {
    const { id, activeTabId: oldActiveId } = oldProps, { activeTabId: newActiveId } = newProps;
    return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
});
export default Panel;
