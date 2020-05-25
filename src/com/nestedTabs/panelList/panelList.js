import React, { useEffect, useRef, useContext, memo } from 'react';
import './index.css';
import Panel from '../panel/panel.js';
import { ApiContext, StateContext } from '../utils/context.js';

const PanelList = memo(function PanelList(props) {
    const counterObj = useRef(0);
    counterObj.current++;
    const { openTabsId, activeTabId } = useContext(StateContext), api = useContext(ApiContext),
        { classNames: { panelList: defaultClass } } = api.getMutableCurrentOptions();

    useEffect(() => {
        api.panelListDidUpdateByActiveTabId(activeTabId, counterObj.current);
    }, [activeTabId]);

    return (
        <div className={`nestedTab_panelList${defaultClass}`}>
            {openTabsId.map(id =>
                <Panel key={id} id={id}></Panel>
            )}
        </div>
    )
}, () => true);

export default PanelList;