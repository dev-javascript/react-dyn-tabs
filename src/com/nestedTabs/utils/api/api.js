import apiFactory from './api.factory';
import OptionManager from './optionManager';
import PanelProxy from './panelProxy.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import events from '../events';
import ObservablePattern from './observable';
import getUserProxy from './getUserProxy';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)({ options })
        , panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableOptions().data.activeTabId)
        , activedTabsHistoryIns = new (ActivedTabsHistory)()
        , observablePatternIns = new (ObservablePattern)(Object.keys(events));
    return {
        activedTabsHistoryIns, optionManagerIns, panelProxyIns, helper, observablePatternIns, getUserProxy
    };
};
export default apiFactory.bind(null, getDeps);

