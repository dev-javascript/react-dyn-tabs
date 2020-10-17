import React, { memo } from "react";
import "./index.css";
import { ApiContext, ForceUpdateContext } from "../utils/context.js";
import propsManager from './tabPropsManager';
const Tab = memo(
    function Tab(props) {
        React.useContext(ForceUpdateContext);
        const { id, selectedTabID } = props
            , api = React.useContext(ApiContext), op = api.getOptions(), cssClasses = api.getSetting().cssClasses
            , tabObj = op.data[id]
            , { close: closeClass } = cssClasses
            , isSelected = selectedTabID === id
            , clkHandler = function (e) { api.eventHandlerFactory({ e, id }); }
            , liProps = propsManager.getLiProps({ api, id, isSelected })
            , liInnerProps = propsManager.getLiInnerProps({ api, id, isSelected })
            , TabInnerComponent = op.tabComponent;
        return (
            <li {...liProps} onClick={e => { clkHandler(e); }}>
                <TabInnerComponent {...liInnerProps}>{tabObj.title}</TabInnerComponent>
                {
                    tabObj.closable ?
                        (<span className={closeClass} >&times;</span>) : null
                }
            </li>
        );
    },
    (oldProps, newProps) => {
        const { id, selectedTabID: oldActiveId } = oldProps, { selectedTabID: newActiveId } = newProps;
        return oldActiveId === newActiveId || (id !== oldActiveId && (id !== newActiveId));
    }
);
export default Tab;
