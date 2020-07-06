import React, { memo, useEffect } from "react";
import "./index.css";
import { ApiContext, ForceUpdateContext } from "../utils/context.js";
import { useCounter } from '../utils/helperHooks';
import helper from '../utils/helper';
import events from '../utils/events';
const Tab = memo(
    function Tab(props) {
        React.useContext(ForceUpdateContext);
        const [isFirstCall] = useCounter()
            , { id, activeTabId } = props
            , api = React.useContext(ApiContext)
            , { data: { allTabs }, classNames: { tab: defaultClass, activeTab: activeClass, closeIcon, disable: disableClass } }
                = api.getMutableCurrentOptions()
            , tab = allTabs[id]
            , clkHandler = function (e) { api.eventHandlerFactory({ e, id }); };
        let tabClass = activeTabId === id ? (defaultClass + ' ' + activeClass) : defaultClass;
        tab.disable && (tabClass += ' ' + disableClass);
        useEffect(() => {
            api.observable.publisher.trigger(events.tabDidMount, { id });
        }, [id]);
        useEffect(() => {
            return () => {
                api.observable.publisher.trigger(events.tabWillUnmount, { id });
            }
        });
        return (
            <li id={helper.idTemplate.tab(id)} className={tabClass} tabIndex="0"
                onMouseUp={clkHandler} onMouseDown={clkHandler} onClick={clkHandler}>
                <a href={`#${tab.title}`} >{tab.title}</a>
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
