import React, { memo } from "react";
import "./index.css";
import { ApiContext, ForceUpdateContext } from "../utils/context.js";
import helper from '../utils/helper';
import TabTitle from './tabTitle';
const Tab = memo(
    function Tab(props) {
        React.useContext(ForceUpdateContext);
        const { id, selectedTabID } = props
            , api = React.useContext(ApiContext)
            , tabObj = api.getOptions().data[id]
            , { cssClasses: { title, tab, close, disable } } = api.getSetting()
            , isActive = selectedTabID === id
            , clkHandler = function (e, type) { api.eventHandlerFactory({ e, id, type }); }
            , basedOnIsActive = {
                tabClass: tab,
                tabIndex: -1,
                ariaExpanded: false,
                ariaSelected: false
            };
        isActive && Object.assign(basedOnIsActive, {
            tabIndex: 0,
            ariaExpanded: true,
            ariaSelected: true
        });
        tabObj.disable && (basedOnIsActive.tabClass += ' ' + disable);
        return (
            <li role='tab' id={helper.idTemplate.tab(id)} className={basedOnIsActive.tabClass}
                tabIndex={basedOnIsActive.tabIndex}
                aria-controls={helper.idTemplate.panel(id)} aria-labelledby={helper.idTemplate.ariaLabelledby(id)}
                aria-selected={basedOnIsActive.ariaSelected} aria-expanded={basedOnIsActive.ariaExpanded}
            >
                <div onClick={e => { clkHandler(e, 'select'); }} role='presentation' className={title}>
                    <TabTitle tabId={id} api={api.userProxy} setting={api.getSetting()} isActive={isActive}></TabTitle>
                </div>
                {
                    tabObj.closable ? (<span role='presentation' className={close}
                        onClick={e => { clkHandler(e, 'close'); }}>&times;
                    </span>) : null
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
