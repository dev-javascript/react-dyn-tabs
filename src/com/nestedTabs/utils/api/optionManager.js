import factory from './optionManager.factory';
import getSetting from './getSetting';
import ArgumentsValidation from './argumentsValidation';
const getDeps = function () {
    const ArgumentsValidationIns = new (ArgumentsValidation)('useNestedTabs')
        , setting = getSetting()
    return { setting, ArgumentsValidationIns };
};
export default factory.bind(null, getDeps);