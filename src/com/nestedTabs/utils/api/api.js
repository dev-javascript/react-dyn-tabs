import apiFactory from './api.factory';
import OptionManager from '../optionManager';
import PanelProxy from '../panelProxy.js';
import { objDefineNoneEnumerableProps } from '../helper';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)(options),
        panelProxyIns = new (PanelProxy)(optionManagerIns.getMutableCurrentOptions().data.activeTabId);
    return { optionManagerIns, panelProxyIns, objDefineNoneEnumerableProps };
};
export default apiFactory.bind(null, getDeps);

