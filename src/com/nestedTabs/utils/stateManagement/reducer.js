import actions from './actions.js';
export default function reducer(state, action) {
    switch (action.type) {
        case actions.close:
            {
                let arr = state.openTabsId;
                arr.splice(arr.indexOf(action.tabId), 1);
                return { ...state };
            }
        case actions.open:
            {
                state.openTabsId.push(action.tabId);
                return { ...state };
            }
        case actions.deActive:
            return { ...Object.assign(state, { activeTabId: '' }) };
        case actions.active:
            {
                state.activeTabId = action.tabId;
                return { ...state };
            }

        default:
            throw new Error(`Undefined action type '${action.type}'`);
    }
};