import actions from './actions.js';
import helper from '../helper';
export default function reducer(state, action) {
    switch (action.type) {
        case actions.close:
            {
                const { openTabsId: arr } = state, removedItemIndex = arr.indexOf(action.tabId);
                if (removedItemIndex >= 0) {
                    arr.splice(removedItemIndex, 1);
                    state = helper.getCopyState(state);
                }
                return state;
            }
        case actions.setData: {
            action.hasOwnProperty('openTabsId') && (state.openTabsId = action.openTabsId);
            action.hasOwnProperty('activeTabId') && (state.activeTabId = action.activeTabId);
            return helper.getCopyState(state);
        }
        case actions.open:
            {
                state.openTabsId.push(action.tabId);
                return helper.getCopyState(state);
            }
        case actions.forceUpdate:
            return helper.getCopyState(state);
        case actions.active:
            {
                state.activeTabId = action.tabId;
                return helper.getCopyState(state);
            }

        default:
            throw new Error(`Undefined action type '${action.type}'`);
    }
};