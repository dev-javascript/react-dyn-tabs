import apiFactory from './api.factory';
import OptionManager from '../optionManager';
import PanelProxy from '../panelProxy.js';
import { objDefineNoneEnumerableProps } from '../helper';
import HistoryActiveTabs from '../historyActiveTabs';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)(options),
        panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableCurrentOptions().data.activeTabId),
        historyActiveTabsIns = new (HistoryActiveTabs)();
    return { historyActiveTabsIns, optionManagerIns, panelProxyIns, objDefineNoneEnumerableProps };
};
export default apiFactory.bind(null, getDeps);

