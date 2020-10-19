import React, { memo } from "react";
import "./index.css";
import { ApiContext, ForceUpdateContext } from "../utils/context.js";
import propsManager from './tabPropsManager';
const Tab = memo(
    function Tab(props) {
        React.useContext(ForceUpdateContext);
        const { id, selectedTabID } = props
            , api = React.useContext(ApiContext), op = api.getOptions(), tabObj = op.data[id]
            , propsManagerParam = { api, id, isSelected: selectedTabID === id }
            , clkHandler = function (e) { api.eventHandlerFactory({ e, id }); }
            , TabInnerComponent = op.tabComponent;
        return (
            <li {...propsManager.getTabProps(propsManagerParam)} onClick={e => { clkHandler(e); }}>
                <TabInnerComponent {...propsManager.getTabInnerProps(propsManagerParam)}>
                    {tabObj.title}
                </TabInnerComponent>
                {
                    tabObj.closable ?
                        (<span {...propsManager.getTabCloseIconProps(propsManagerParam)} >&times;</span>) : null
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
