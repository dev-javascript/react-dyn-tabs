import React, { memo, useEffect } from "react";
import "./index.css";
import { ApiContext, ForceUpdateContext } from "../utils/context.js";
import { useCounter } from '../utils/helperHooks';
import { idTemplate } from '../utils/helper';
import events from '../utils/events';
const Tab = memo(
    function Tab(props) {
        React.useContext(ForceUpdateContext);
        const [isFirstCall] = useCounter()
            , { id, activeTabId } = props
            , api = React.useContext(ApiContext)
            , { data: { allTabs }, classNames: { tab: defaultClass, activeTab: activeClass, closeIcon } }
                = api.getMutableCurrentOptions()
            , tab = allTabs[id]
            , tabClass = activeTabId === id ? (defaultClass + ' ' + activeClass) : defaultClass
            , clkHandler = function (e) { api.eventHandlerFactory({ e, id }); };
        useEffect(() => {
            api.observable.publisher.trigger(events.tabDidMount, { id });
        }, [id]);
        useEffect(() => {
            return () => {
                api.observable.publisher.trigger(events.tabWillUnmount, { id });
            }
        });
        return (
            <li id={idTemplate.tab(id)} className={tabClass} tabIndex="0"
                onMouseUp={clkHandler} onMouseDown={clkHandler} onClick={clkHandler}>
                <span>{tab.title}</span>
                {
                    tab.closable ? (<span className={closeIcon}>
                        &times;
                    </span>) : null
                }
            </li>
        );
    },
    (oldProps, newProps) => {
        const { id, activeTabId: oldActiveId } = oldProps, { activeTabId: newActiveId } = newProps;
        return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
    }
);
export default Tab;
