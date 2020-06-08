import apiFactory from './api.factory';
import OptionManager from '../optionManager';
import renderedComponent from '../renderedComponent.js';
import { objDefineNoneEnumerableProps } from '../helper';
const getDeps = function (options) {
    const optionManagerIns = new (OptionManager)(options),
        renderedComponentIns = new (renderedComponent)(),
        { activeTabId, panelComponent } = optionManagerIns.getActiveTab();
    activeTabId && renderedComponentIns.addById(activeTabId, panelComponent);
    return { optionManagerIns, renderedComponentIns, objDefineNoneEnumerableProps };
};
export default apiFactory.bind(null, getDeps);

