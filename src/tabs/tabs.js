import {forwardRef} from 'react';
import Tabs from './tabs.factory.js';
import Tab from '../tab/tab.js';
export default forwardRef(
  Tabs.bind(undefined, (api) => ({
    Tab,
    tabsPropsGenerator: (parentProps) => api.tabsPropsGenerator(parentProps),
  })),
);
