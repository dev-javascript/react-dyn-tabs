import {forwardRef} from 'react';
import Tabs from './tabs.factory.js';
import Tab from '../tab/tab.js';
export default forwardRef(
  Tabs.bind(undefined, () => ({
    Tab,
    getTabsProps: ({api, dir, isVertical}) => api.getTabsProps(dir, isVertical),
  })),
);
