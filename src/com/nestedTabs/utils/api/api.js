import apiFactory from './api.factory';
import OptionManager from '../optionManager';
import PanelProxy from '../panelProxy.js';
import { objDefineNoneEnumerableProps } from '../helper';
import ActivedTabsHistory from '../activedTabsHistory';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)(options),
        panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableCurrentOptions().data.activeTabId),
        activedTabsHistoryIns = new (ActivedTabsHistory)();
    return {
        activedTabsHistoryIns, optionManagerIns,
        panelProxyIns, objDefineNoneEnumerableProps
    };
};
export default apiFactory.bind(null, getDeps);

