import factory from './optionManager.factory.js';
import DefaultTabInnerComponent from '../../../tab/defaulTabInner.js';
import DefaultOptions from './defaultOptions.js';
const getDeps = function () {
  const op = new DefaultOptions(DefaultTabInnerComponent);
  return {globalDefaultOptions: op.getOptions(), internalOptions: op.getInternalOptions()};
};
export default factory.bind(null, getDeps);
