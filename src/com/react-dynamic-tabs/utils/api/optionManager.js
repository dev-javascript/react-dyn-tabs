import factory from './optionManager.factory';
import getSetting from './getSetting';
import useDynamicTabs from '../../useDynamicTabs';
import TabTitleComponent from '../../tab/tabTitle.default';
const getDeps = function () {
    const setting = getSetting(), globalDefaultOptions = useDynamicTabs.defaultOptions;
    return { setting, globalDefaultOptions, TabTitleComponent };
};
export default factory.bind(null, getDeps);