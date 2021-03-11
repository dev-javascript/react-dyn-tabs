import React, { memo } from "react";
import "./index.css";
import { ApiContext, ForceUpdateContext } from "../utils/context.js";
import TabPropsManager from './tabPropsManager.js';
const Tab = memo(
    function Tab(props) {
        React.useContext(ForceUpdateContext);
        const { id, selectedTabID } = props
            , api = React.useContext(ApiContext)
            , TabInnerComponent = api.getOption('tabComponent')
            , tabObj = api.getTab(id)
            , propsManager = new TabPropsManager({ api, id, isSelected: selectedTabID === id })
            , clkHandler = function (e) { api.eventHandlerFactory({ e, id }); };
        return (
            <li {...propsManager.getTabProps()} onClick={e => { clkHandler(e); }}>
                <TabInnerComponent {...propsManager.getTabInnerProps()}>
                    {tabObj.title}
                </TabInnerComponent>
                {
                    tabObj.closable ?
                        (<span {...propsManager.getCloseIconProps()} >&times;</span>) : null
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
