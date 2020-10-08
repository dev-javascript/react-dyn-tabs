import factory from './optionManager.factory';
import getSetting from './getSetting';
import ArgumentsValidation from './argumentsValidation';
import useDynamicTabs from '../../useDynamicTabs';
const getDeps = function () {
    const ArgumentsValidationIns = new (ArgumentsValidation)('useNestedTabs')
        , setting = getSetting(), globalDefaultOptions = useDynamicTabs.defaultOptions;
    return { setting, ArgumentsValidationIns, globalDefaultOptions };
};
export default factory.bind(null, getDeps);