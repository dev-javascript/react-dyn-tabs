import factory from './defaultOptions.factory';
import ArgumentsValidation from './argumentsValidation';
const getDeps = function () {
    const ArgumentsValidationIns = new (ArgumentsValidation)('useNestedTabs');
    return { ArgumentsValidationIns };
};
export default factory.bind(null, getDeps);