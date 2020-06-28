import React, { useContext, memo, useEffect, useRef } from 'react';
import './index.css';
import { ApiContext } from '../utils/context.js';
import { useCounter } from '../utils/helperHooks';
import { idTemplate } from '../utils/helper';
const Panel = memo(function Panel(props) {
    const [isFirstCall] = useCounter()
        , { id, activeTabId } = props
        , isActive = activeTabId === id
        , api = useContext(ApiContext)
        , { classNames: { panel: defaultClass, activePanel: activeClass } } = api.getMutableCurrentOptions()
        , panelClass = isActive ? (defaultClass + ' ' + activeClass) : defaultClass;

    useEffect(() => {
        api.panelDidMount({ id, isActive });
    }, [id]);
    useEffect(() => {
        api.panelDidUpdate({ id, isActive, isFirstCall });
        return () => {
            api.panelWillUnmount({ id, isActive });
        }
    }, [activeTabId]);

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
