import apiFactory from './api.factory';
import OptionManager from './optionManager';
import PanelProxy from './panelProxy.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import getUserProxy from './getUserProxy';
import Publisher from './publisher.js';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)({ options })
        , panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableOptions().selectedTabID)
        , activedTabsHistoryIns = new (ActivedTabsHistory)();
    return {
        activedTabsHistoryIns, optionManagerIns, panelProxyIns, helper, Publisher, getUserProxy
    };
};
export default apiFactory.bind(null, getDeps);

