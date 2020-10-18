import factory from './optionManager.factory';
import Setting from './setting';
import useDynamicTabs from '../../../useDynamicTabs';
import DefaulTabInnerComponent from '../../../tab/defaulTabInner';
const getDeps = function () {
    const setting = new (Setting)().get(), globalDefaultOptions = useDynamicTabs.defaultOptions;
    return { setting, globalDefaultOptions, DefaulTabInnerComponent };
};
export default factory.bind(null, getDeps);