import apiFactory from './api.factory';
import OptionManager from '../optionManager';
import PanelProxy from '../panelProxy.js';
import { objDefineNoneEnumerableProps } from '../helper';
import ActivedTabsHistory from '../activedTabsHistory';
import events from '../events';
import ObservablePattern from '../observable';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)(options),
        panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableCurrentOptions().data.activeTabId),
        activedTabsHistoryIns = new (ActivedTabsHistory)(),
        observablePattern = new (ObservablePattern)(Object.keys(events));
    return {
        activedTabsHistoryIns, optionManagerIns, panelProxyIns, objDefineNoneEnumerableProps
        , observablePattern
    };
};
export default apiFactory.bind(null, getDeps);

