import React, { useContext, memo, useEffect, useRef } from 'react';
import './index.css';
import { ApiContext, ForceUpdateContext } from '../utils/context.js';
import { useCounter } from '../utils/helperHooks';
import helper from '../utils/helper';
import events from '../utils/events';
const Panel = memo(function Panel(props) {
    React.useContext(ForceUpdateContext);
    const [isFirstCall] = useCounter()
        , { id, activeTabId } = props
        , api = useContext(ApiContext)
        , { classNames: { panel: defaultClass, activePanel: activeClass } } = api.getMutableCurrentOptions()
        , basedOnIsActive = {
            panelClass: defaultClass,
            ariaHidden: true
        };
    activeTabId === id && Object.assign(basedOnIsActive, {
        panelClass: defaultClass + ' ' + activeClass,
        ariaHidden: false
    });

    useEffect(() => {
        api.observable.publisher.trigger(events.panelDidMount, { id });
    }, [id]);
    useEffect(() => {
        return () => {
            api.observable.publisher.trigger(events.panelWillUnmount, { id });
        }
    });
    return (
        <div id={helper.idTemplate.panel(id)} className={basedOnIsActive.panelClass}
            aria-labelledby={helper.idTemplate.ariaLabelledby(id)} role='tabpanel'
            aria-hidden={basedOnIsActive.ariaHidden}>
            {api.getPanel(id)}
        </div>
    )
}, (oldProps, newProps) => {
    const { id, activeTabId: oldActiveId } = oldProps, { activeTabId: newActiveId } = newProps;
    return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
});
export default Panel;
