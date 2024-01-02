import Tab from './tab.factory.js';
import memomizeTab from './memomizeTab.js';
export default memomizeTab(
  Tab.bind(undefined, () => ({
    getTabProps: ({api, id, isSelected}) => api.getTabProps(id, isSelected),
    getTabInnerProps: ({api, id, isSelected}) => api.getTabInnerProps(id, isSelected),
    getCloseIconProps: (api) => api.getCloseIconProps(),
  })),
);
