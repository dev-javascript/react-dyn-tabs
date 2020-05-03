import actions from './actions.js';
export default function reducer(state, action) {
    debugger;
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
                let id = action.tabId;
                action.addRenderedCom();
                state.activeTabId = id;
                return { ...state };
            }

        default:
            throw new Error(`Undefined action type '${action.type}'`);
    }
};