import {memo, forwardRef} from 'react';
import TabList from './tabList.factory.js';
import Tabs from '../tabs/tabs.js';
const MemomizedTabList = memo(
  forwardRef(
    TabList.bind(undefined, (api, ref, openTabIDs, selectedTabID) => ({
      Tabs,
      getTablistProps: () => api.getTablistProps(ref, openTabIDs, selectedTabID),
    })),
  ),
  () => true,
);
export default MemomizedTabList;
