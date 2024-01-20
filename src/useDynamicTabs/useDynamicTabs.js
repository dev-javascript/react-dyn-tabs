/* eslint react/prop-types: 0 */
import React, {useState, useReducer, useLayoutEffect, useRef} from 'react';
function useDynamicTabs(getDeps, options = {}, modules) {
  const {reducer, getApiInstance, ApiContext, StateContext, ForceUpdateContext, Components} = getDeps();
  const ref = useRef(null);
  if (ref.current === null)
    ref.current = {api: getApiInstance(options, modules, Components), TabListComponent: null, PanelListComponent: null};
  const {
      current: {api},
    } = ref,
    _ref = ref.current,
    [state, dispatch] = useReducer(reducer, api.optionsManager.initialState),
    [flushState, setFlushState] = useState({});
  api.updateStateRef(state, dispatch).updateFlushState(setFlushState);
  useLayoutEffect(() => {
    api.updateState(state);
  }, [state]);
  useLayoutEffect(() => {
    api.trigger('onLoad', api.userProxy);
    return () => {
      api.trigger('onDestroy', api.userProxy);
    };
  }, []);
  useLayoutEffect(() => {
    api.trigger('onInit', api.userProxy);
  });
  useLayoutEffect(() => {
    api.trigger('_onReady', api.userProxy);
  }, []);
  useLayoutEffect(() => {
    const oldState = api.previousState,
      [openedTabIDs, closedTabIDs] = api.helper.getArraysDiff(state.openTabIDs, oldState.openTabIDs),
      isSwitched = oldState.selectedTabID !== state.selectedTabID;
    api.onChange({newState: state, oldState, closedTabIDs, openedTabIDs, isSwitched});
  }, [state]);
  useLayoutEffect(() => {
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
              <Components.TablistView>
                <Components.TablistContainer>
                  <Components.TablistOverflow>
                    <Components.TabList {...props}></Components.TabList>
                    {/* <api.optionsManager.internalOptions.TabIndicator /> */}
                  </Components.TablistOverflow>
                </Components.TablistContainer>
                {props.children}
              </Components.TablistView>
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
              <Components.PanelList {...props}>props.children</Components.PanelList>
            </ForceUpdateContext.Provider>
          </StateContext.Provider>
        </ApiContext.Provider>
      );
    };
  return [_ref.TabListComponent, _ref.PanelListCompoent, api.ready];
}
export default useDynamicTabs;
