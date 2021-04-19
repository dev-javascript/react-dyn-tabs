
import React, { useReducer, useLayoutEffect, useRef } from "react";
import TabList from "../tabList/tabList";
import PanelList from "../panelList/panelList.js";
import reducer from "../utils/stateManagement/reducer";
import Api from '../utils/api';
import { ApiContext, StateContext, ForceUpdateContext } from "../utils/context.js";
function useDynamicTabs(options) {
    const ref = useRef(null);
    if (ref.current === null)
        ref.current = { api: new (Api)({ options }), TabListComponent: null, PanelListComponent: null };
    const { current: { api } } = ref
        , _ref = ref.current
        , [state, dispatch] = useReducer(reducer, api.getInitialState());
    api.updateStateRef(state).updateDispatch(dispatch).setPerviousState(state);
    useLayoutEffect(() => {
        api.trigger('onLoad', api.userProxy);
        return () => { api.trigger('onDestroy', api.userProxy); };
    }, []);
    useLayoutEffect(() => {
        api.updatePerviousState(state);
    }, [state]);
    useLayoutEffect(() => {
        api.trigger('onInit', api.userProxy);
    });
    useLayoutEffect(() => {
        const oldState = api.getCopyPerviousData()
            , [openedTabsId, closedTabsId] = api.helper.getArraysDiff(state.openTabIDs, oldState.openTabIDs)
            , isSwitched = oldState.selectedTabID !== state.selectedTabID;
        api.onChange({ newState: state, oldState, closedTabsId, openedTabsId, isSwitched });
    }, [state]);
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
    return [_ref.TabListComponent, _ref.PanelListCompoent, api.userProxy];
}
export default useDynamicTabs;
