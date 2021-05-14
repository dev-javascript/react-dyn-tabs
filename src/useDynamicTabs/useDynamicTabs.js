
import React, { useState, useReducer, useLayoutEffect, useRef } from "react";
function useDynamicTabs(getDeps, options = {}) {
    const { reducer, getApiInstance, PanelList, TabList, ApiContext, StateContext, ForceUpdateContext } = getDeps();
    const ref = useRef(null);
    if (ref.current === null)
        ref.current = { api: getApiInstance(options), TabListComponent: null, PanelListComponent: null };
    const { current: { api } } = ref
        , _ref = ref.current
        , [state, dispatch] = useReducer(reducer, api.getInitialState())
        , [flushState, setFlushState] = useState({});
    api.updateStateRef(state, dispatch).updateFlushState(setFlushState);
    useLayoutEffect(() => {
        api.trigger('onLoad', api.userProxy);
        return () => { api.trigger('onDestroy', api.userProxy); };
    }, []);
    useLayoutEffect(() => {
        api.updateState(state);
    }, [state]);
    useLayoutEffect(() => {
        api.trigger('onInit', api.userProxy);
    });
    useLayoutEffect(() => {
        api.trigger('_onReady', api.userProxy);
    }, []);
    useLayoutEffect(() => {
        const oldState = api.getCopyPerviousData()
            , [openedTabsId, closedTabsId] = api.helper.getArraysDiff(state.openTabIDs, oldState.openTabIDs)
            , isSwitched = oldState.selectedTabID !== state.selectedTabID;
        api.onChange({ newState: state, oldState, closedTabsId, openedTabsId, isSwitched });
    }, [state]);
    useLayoutEffect(() => {
        api.trigger('_onFlushEffects', api.userProxy, { currentData: api.getCopyData(), instance: api.userProxy });
    }, [flushState]);
    if (!_ref.TabListComponent)
        _ref.TabListComponent = (props = {}) => {
            return (
                <ApiContext.Provider value={api}>
                    <StateContext.Provider value={api.stateRef}>
                        <ForceUpdateContext.Provider value={api.forceUpdateState}>
                            <TabList {...props}>props.children</TabList>
                        </ForceUpdateContext.Provider>
                    </StateContext.Provider>
                </ApiContext.Provider>
            );
        };
    if (!_ref.PanelListCompoent)
        _ref.PanelListCompoent = props => (
            <ApiContext.Provider value={api}>
                <StateContext.Provider value={api.stateRef}>
                    <ForceUpdateContext.Provider value={api.forceUpdateState}>
                        <PanelList {...props}>props.children</PanelList>
                    </ForceUpdateContext.Provider>
                </StateContext.Provider>
            </ApiContext.Provider>
        );
    return [_ref.TabListComponent, _ref.PanelListCompoent, api.ready];
}
export default useDynamicTabs;
