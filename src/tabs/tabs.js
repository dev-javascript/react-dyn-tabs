import {forwardRef} from 'react';
import Tabs from './tabs.factory.js';
import Tab from '../tab/tab.js';
export default forwardRef(
  Tabs.bind(undefined, (api) => ({
    Tab,
    tabsPropsGenerator: (dir, isVertical) => api.tabsPropsGenerator(dir, isVertical),
  })),
);
