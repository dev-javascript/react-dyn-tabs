import apiFactory from './api.factory';
import OptionManager from './optionManager';
import PanelProxy from './panelProxy.js';
import helper from '../helper';
import ActivedTabsHistory from './activedTabsHistory';
import getPublishers from './getPublishers';
import getUserProxy from './getUserProxy';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)({ options })
        , panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableOptions().activeTabId)
        , activedTabsHistoryIns = new (ActivedTabsHistory)()
        , publisherIns = getPublishers();
    return {
        activedTabsHistoryIns, optionManagerIns, panelProxyIns, helper, publisherIns, getUserProxy
    };
};
export default apiFactory.bind(null, getDeps);

