import actions from './actions.js';
import helper from '../helper';
export default function reducer(state, action) {
    switch (action.type) {
        case actions.close:
            {
                const { openTabIDs: arr } = state, removedItemIndex = arr.indexOf(action.tabId);
                if (removedItemIndex >= 0) {
                    arr.splice(removedItemIndex, 1);
                    state = helper.getCopyState(state);
                }
                return state;
            }
        case actions.setData: {
            state.openTabIDs = action.openTabIDs;
            state.selectedTabID = action.selectedTabID;
            return helper.getCopyState(state);
        }
        case actions.open:
            {
                const arr = state.openTabIDs, tabId = action.tabId;
                if (arr.indexOf(tabId) === -1) {
                    arr.push(tabId);
                    return helper.getCopyState(state);
                }
                return state;
            }
        case actions.forceUpdate:
            return helper.getCopyState(state);
        case actions.active:
            {
                const tabId = action.tabId;
                if (state.selectedTabID !== tabId) {
                    state.selectedTabID = tabId;
                    return helper.getCopyState(state);
                }
                return state;
            }

        default:
            throw new Error(`Undefined action type '${action.type}'`);
    }
};