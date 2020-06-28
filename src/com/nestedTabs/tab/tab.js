import React, { memo, useEffect } from "react";
import "./index.css";
import { ApiContext } from "../utils/context.js";
import { useCounter } from '../utils/helperHooks';
import { idTemplate } from '../utils/helper';
const Tab = memo(
    function Tab(props) {
        const [isFirstCall] = useCounter()
            , { id, activeTabId } = props
            , api = React.useContext(ApiContext)
            , { data: { allTabs }, classNames: { tab: defaultClass, activeTab: activeClass, closeIcon } }
                = api.getMutableCurrentOptions()
            , tab = allTabs[id]
            , tabClass = activeTabId === id ? (defaultClass + ' ' + activeClass) : defaultClass
            , clkHandler = function (e) { api.eventHandlerFactory({ e, id }); };
        useEffect(() => {
            api.tabDidMount({ id });
        }, [id]);
        useEffect(() => {
            api.tabDidUpdate({ id, isFirstCall });
            return () => {
                api.tabWillUnmount({ id });
            }
        }, [activeTabId]);
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
