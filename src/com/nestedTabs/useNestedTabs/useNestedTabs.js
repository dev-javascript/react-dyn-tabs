import React, { useReducer, useEffect, useMemo, useRef } from "react";
import TabList from "../tabList/tabList";
import PanelList from "../panelList/panelList.js";
import { reducer } from "../utils/stateManagement";
import externalApiInstance from '../utils/externalApiInstance';
import { ApiContext, StateContext } from "../utils/context.js";
function useNestedTabs(options) {
    const initialOptions = useMemo(() => options, []);
    const { data: { activeTabId, openTabsId }, } = initialOptions;
    const [state, dispatch] = useReducer(reducer, { activeTabId, openTabsId });

    const ref = useRef(null);
    ref.current || (ref.current = { api: externalApiInstance({ options }) });
    const { current: { api } } = ref;
    api.updateReducer(state, dispatch);

    const tabListEl = (
        <ApiContext.Provider value={ref.current.api}>
            <StateContext.Provider value={state}>
                <TabList></TabList>
            </StateContext.Provider>
        </ApiContext.Provider>
    );
    const panelListEl = (
        <ApiContext.Provider value={ref.current.api}>
            <StateContext.Provider value={state}>
                <PanelList></PanelList>
            </StateContext.Provider>
        </ApiContext.Provider>
    );
    return [tabListEl, panelListEl, ref.current.api];
}
export default useNestedTabs;
