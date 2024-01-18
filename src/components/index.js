import TabList, {tablistPropsManager} from '../tabList/tabList.js';
import TabListFactory from '../tabList/tabList.factory.js';
import PanelList from '../panelList/panelList.js';
import TablistView, {tablistViewPropsManager} from '../tablistView/tablistView.js';
import TablistViewFactory from '../tablistView/tablistView.factory.js';
import TablistContainer, {tablistContainerPropsManager} from '../tablistContainer/tablistContainer.js';
import TablistContainerFactory from '../tablistContainer/tablistContainer.factory.js';
import Tabs, {TabsPropsManager} from '../tabs/tabs.js';
import TabsFactory from '../tabs/tabs.factory.js';
import Tab, {tabPropsManager, tabInnerPropsManager, closeIconPropsManager} from '../tab/tab.js';
import TabFactory from '../tab/tab.factory.js';
import memomizeTab from '../tab/memomizeTab.js';
import {useApi, useRootState, useForceUpdate} from '../hooks.js';
export default {
  TablistView,
  tablistViewPropsManager,
  TablistViewFactory,
  TablistContainer,
  tablistContainerPropsManager,
  TablistContainerFactory,
  TabList,
  tablistPropsManager,
  TabListFactory,
  Tabs,
  TabsPropsManager,
  TabsFactory,
  Tab,
  tabPropsManager,
  tabInnerPropsManager,
  closeIconPropsManager,
  TabFactory,
  memomizeTab,
  PanelList,
  useApi,
  useRootState,
  useForceUpdate,
};
