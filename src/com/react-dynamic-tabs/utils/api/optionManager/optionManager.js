import factory from './optionManager.factory';
import getSetting from './getSetting';
import useDynamicTabs from '../../../useDynamicTabs';
import DefaulTabInnerComponent from '../../../tab/defaulTabInner';
const getDeps = function () {
    const setting = getSetting(), globalDefaultOptions = useDynamicTabs.defaultOptions;
    return { setting, globalDefaultOptions, DefaulTabInnerComponent };
};
export default factory.bind(null, getDeps);