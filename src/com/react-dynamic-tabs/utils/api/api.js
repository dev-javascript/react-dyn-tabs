import apiFactory from './api.factory';
import OptionManager from './optionManager/optionManager.js';
import PanelProxy from './panelProxy.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import getUserProxy from './getUserProxy';
import Pub_Sub from './pub_sub.js';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)({ options })
        , panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableOptions().selectedTabID)
        , activedTabsHistoryIns = new (ActivedTabsHistory)()
        , pub_sub_Instance = new Pub_Sub();
    return {
        activedTabsHistoryIns, optionManagerIns, panelProxyIns, helper, pub_sub_Instance, getUserProxy
    };
};
export default apiFactory.bind(null, getDeps);

