import Tab from './tab.factory.js';
import memomizeTab from './memomizeTab.js';
export default memomizeTab(
  Tab.bind(undefined, () => ({
    tabPropsGenerator: ({api, id, isSelected}) => api.tabPropsGenerator(id, isSelected),
    tabInnerPropsGenerator: ({api, id, isSelected}) => api.tabInnerPropsGenerator(id, isSelected),
    closeIconPropsGenerator: (api) => api.closeIconPropsGenerator(),
  })),
);
