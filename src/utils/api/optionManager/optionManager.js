import factory from './optionManager.factory.js';
import DefaultTabInnerComponent from '../../../tab/defaulTabInner.js';
import DefaultOptions from './defaultOptions.js';
import {Tabs} from '../../../tabList/tabList.js';
const getDeps = function () {
  const globalDefaultOptions = new DefaultOptions(DefaultTabInnerComponent).getOptions();
  return {globalDefaultOptions, Tabs};
};
export default factory.bind(null, getDeps);
