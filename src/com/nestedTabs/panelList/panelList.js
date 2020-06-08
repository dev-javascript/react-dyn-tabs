import React, { useEffect, memo } from 'react';
import './index.css';
import Panel from '../panel/panel.js';
import { ApiContext, StateContext } from '../utils/context.js';
import { useCounter, useOldActiveId } from '../utils/helperHooks';
const PanelList = memo(function PanelList(props) {
    const [isFirstCall] = useCounter()
        , { openTabsId, activeTabId } = React.useContext(StateContext)
        , { oldActiveId, newActiveId, updateOldActiveId } = useOldActiveId(activeTabId)
        , api = React.useContext(ApiContext)
        , { classNames: { panelList: defaultClass } } = api.getMutableCurrentOptions();
    useEffect(() => {
        api.panelListDidUpdateByActiveTabId({ oldActiveId, newActiveId, isFirstCall });
        updateOldActiveId();
    }, [activeTabId]);
    return (
        <div className={defaultClass}>
            {openTabsId.map(id =>
                <Panel key={id} id={id} activeTabId={activeTabId}></Panel>
            )}
        </div>
    )
}, () => true);

export default PanelList;