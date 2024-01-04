import reducer from '../utils/stateManagement/reducer.js';
import Api from '../utils/api/api.js';
import useDynTabs from './useDynamicTabs.js';
import {ApiContext, StateContext, ForceUpdateContext} from '../utils/context.js';
import Components from '../components/index.js';
const getDeps = function () {
  const getApiInstance = (options, modules, Components) => {
    return new Api({options}, modules, Components);
  };
  return {
    reducer,
    getApiInstance,
    ApiContext,
    StateContext,
    ForceUpdateContext,
    Components,
  };
};
export default useDynTabs.bind(null, getDeps);
