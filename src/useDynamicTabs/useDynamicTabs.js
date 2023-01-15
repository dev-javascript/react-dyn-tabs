import React, {useState, useReducer, useLayoutEffect, useEffect, useRef} from 'react';
function useDynamicTabs(getDeps, options = {}, plugins = []) {
  const {reducer, getApiInstance, PanelList, TabList, ApiContext, StateContext, ForceUpdateContext} = getDeps();
  const ref = useRef(null);
  if (ref.current === null)
    ref.current = {api: getApiInstance(options, plugins), TabListComponent: null, PanelListComponent: null};
  const {
      current: {api},
    } = ref,
    _ref = ref.current,
    [state, dispatch] = useReducer(reducer, api.optionsManager.initialState),
    [flushState, setFlushState] = useState({});
  api.updateStateRef(state, dispatch).updateFlushState(setFlushState);
  useEffect(() => {
    api.updateState(state);
  }, [state]);
  useLayoutEffect(() => {
    api.trigger('_beforeLoad', api.userProxy);
  }, []);
  useEffect(() => {
    api.trigger('onLoad', api.userProxy);
    return () => {
      api.trigger('onDestroy', api.userProxy);
    };
  }, []);
  useEffect(() => {
    api.trigger('onInit', api.userProxy);
  });
  useEffect(() => {
    api.trigger('_onReady', api.userProxy);
  }, []);
  useLayoutEffect(() => {
    api.trigger('_beforeChange', api.userProxy);
  }, [state]);
  useEffect(() => {
    const oldState = api.previousState,
      [openedTabIDs, closedTabIDs] = api.helper.getArraysDiff(state.openTabIDs, oldState.openTabIDs),
      isSwitched = oldState.selectedTabID !== state.selectedTabID;
    api.onChange({newState: state, oldState, closedTabIDs, openedTabIDs, isSwitched});
  }, [state]);
  useEffect(() => {
    api.trigger('_onFlushEffects', api.userProxy, () => {
      return [{currentData: api.getData(), instance: api.userProxy}];
    });
  }, [flushState]);
  if (!_ref.TabListComponent)
    _ref.TabListComponent = function TabListComponent(props = {}) {
      return (
        <ApiContext.Provider value={api}>
          <StateContext.Provider value={api.stateRef}>
            <ForceUpdateContext.Provider value={api.forceUpdateState}>
              <TabList ref={api.tablistRef} {...props}>
                props.children
              </TabList>
            </ForceUpdateContext.Provider>
          </StateContext.Provider>
        </ApiContext.Provider>
      );
    };
  if (!_ref.PanelListCompoent)
    _ref.PanelListCompoent = function PanelListCompoent(props) {
      return (
        <ApiContext.Provider value={api}>
          <StateContext.Provider value={api.stateRef}>
            <ForceUpdateContext.Provider value={api.forceUpdateState}>
              <PanelList {...props}>props.children</PanelList>
            </ForceUpdateContext.Provider>
          </StateContext.Provider>
        </ApiContext.Provider>
      );
    };
  return [_ref.TabListComponent, _ref.PanelListCompoent, api.ready];
}
export default useDynamicTabs;
