import Tab from './tab.factory.js';
import memomizeTab from './memomizeTab.js';
export default memomizeTab(
  Tab.bind(undefined, () => ({
    tabPropsGenerator: (api, parentProps) => api.tabPropsGenerator(parentProps),
    tabInnerPropsGenerator: (api, parentProps) => api.tabInnerPropsGenerator(parentProps),
    closeIconPropsGenerator: (api) => api.closeIconPropsGenerator(),
  })),
);
