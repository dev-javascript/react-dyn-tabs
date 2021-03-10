import factory from './optionManager.factory.js';
import useDynamicTabs from '../../../useDynamicTabs/index.js';
const getDeps = function () {
    const globalDefaultOptions = useDynamicTabs.options;
    return { globalDefaultOptions };
};
export default factory.bind(null, getDeps);