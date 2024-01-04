import {memo, forwardRef} from 'react';
import TabList from './tabList.factory.js';
import Tabs from '../tabs/tabs.js';
const MemomizedTabList = memo(
  forwardRef(
    TabList.bind(undefined, (api, ref, openTabIDs, selectedTabID) => ({
      Tabs,
      tablistPropsGenerator: () => api.tablistPropsGenerator(ref, openTabIDs, selectedTabID),
    })),
  ),
  () => true,
);
export default MemomizedTabList;
