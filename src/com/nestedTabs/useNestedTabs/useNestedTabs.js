import React, { useReducer, useEffect, useMemo, useRef } from "react";
import TabList from "../tabList/tabList";
import PanelList from "../panelList/panelList.js";
import { reducer } from "../utils/stateManagement";
import Api from '../utils/api';
import { ApiContext, StateContext } from "../utils/context.js";
function useNestedTabs(options) {

    const ref = useRef(null);
    if (ref.current == null) {
        if (!(options && (typeof options === 'object')))
            throw 'invalid passed option! option must be an object';
        ref.current = { api: new (Api)({ options }) };
    }
    const { current: { api } } = ref;
    const [state, dispatch] = useReducer(reducer, api.optionManager.getData());
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
