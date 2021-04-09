import factory from './optionManager.factory.js';
import DefaultTabInnerComponent from '../../../tab/defaulTabInner.js';
import DefaultOptions from './DefaultOptions.js';
const getDeps = function () {
    const globalDefaultOptions = new (DefaultOptions)(DefaultTabInnerComponent).getOptions();
    return { globalDefaultOptions };
};
export default factory.bind(null, getDeps);