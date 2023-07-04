import TabList from '../tabList/tabList.js';
import PanelList from '../panelList/panelList.js';
import TablistView from '../tablistView/tablistView.js';
import TablistContainer from '../tablistContainer/tablistContainer.js';
import reducer from '../utils/stateManagement/reducer.js';
import Api from '../utils/api/api.js';
import useDynTabs from './useDynamicTabs.js';
import {ApiContext, StateContext, ForceUpdateContext} from '../utils/context.js';
const getDeps = function () {
  const getApiInstance = (options, modules) => {
    return new Api({options}, modules);
  };
  return {
    reducer,
    getApiInstance,
    PanelList,
    TabList,
    ApiContext,
    StateContext,
    ForceUpdateContext,
    TablistContainer,
    TablistView,
  };
};
export default useDynTabs.bind(null, getDeps);
