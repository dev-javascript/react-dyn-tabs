import factory from './optionManager.factory';
import getSetting from './getSetting';
import DefaultOptions from './defaultOptions';
import ArgumentsValidation from './argumentsValidation';
const getDeps = function () {
    const ArgumentsValidationIns = new (ArgumentsValidation)('useNestedTabs')
        , setting = getSetting()
        , defaultOptionsIns = new (DefaultOptions)(setting);
    return { setting, defaultOptionsIns, ArgumentsValidationIns };
};
export default factory.bind(null, getDeps);