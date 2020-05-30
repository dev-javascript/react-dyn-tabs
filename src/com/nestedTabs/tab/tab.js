import React, { memo, useEffect } from "react";
import "./index.css";
import { ApiContext } from "../utils/context.js";
import useCounter from '../utils/useCounter';
import idTemplate from '../utils/idTemplate';
const Tab = memo(
    function Tab(props) {
        const [isFirstCall] = useCounter()
            , { id, activeTabId } = props
            , api = React.useContext(ApiContext)
            , isActive = activeTabId === id
            , { data: { allTabs }, classNames: { tab: defaultClass, activeTab: activeClass, closeIcon } }
                = api.getMutableCurrentOptions()
            , tab = allTabs[id]
            , tabClass = isActive ? (defaultClass + ' ' + activeClass) : defaultClass
            , clkHandler = function (e) { api.switchTabEventHandler({ e, id, activeId: activeTabId, isActive }); }
            , closeHandler = function (e) { api.closeTabEventHandler({ e, id, activeId: activeTabId, isActive }); }

        useEffect(() => {
            api.tabDidMount({ id, isActive });
            return () => {
                api.tabWillUnmount({ id, isActive });
            }
        }, [id]);
        useEffect(() => api.tabDidUpdate({ id, isActive, isFirstCall }), [activeTabId]);
        return (
            <li id={idTemplate.tab(id)} className={tabClass} tabIndex="0"
                onMouseUp={clkHandler} onMouseDown={clkHandler} onClick={clkHandler}>
                <span>{tab.title}</span>
                {
                    tab.closable ? (<span className={closeIcon}
                        onMouseUp={closeHandler} onMouseDown={closeHandler} onClick={closeHandler}>
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
