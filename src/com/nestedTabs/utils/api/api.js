import apiFactory from './api.factory';
import OptionManager from '../optionManager';
import PanelProxy from '../panelProxy.js';
import helper from '../helper';
import ActivedTabsHistory from '../activedTabsHistory';
import events from '../events';
import ObservablePattern from '../observable';
import getSetting from '../getSetting';
import DefaultOption from '../defaultOptions';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)({ DefaultOption, options, setting: getSetting() })
        , panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableCurrentOptions().data.activeTabId)
        , activedTabsHistoryIns = new (ActivedTabsHistory)()
        , observablePattern = new (ObservablePattern)(Object.keys(events));
    return {
        activedTabsHistoryIns, optionManagerIns, panelProxyIns, helper, observablePattern
    };
};
export default apiFactory.bind(null, getDeps);

