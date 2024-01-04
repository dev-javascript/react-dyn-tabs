import {memo, forwardRef} from 'react';
import TabList from './tabList.factory.js';
import Tabs from '../tabs/tabs.js';
const MemomizedTabList = memo(
  forwardRef(
    TabList.bind(undefined, (api, ref, state) => ({
      Tabs,
      tablistPropsGenerator: () => api.tablistPropsGenerator(ref, state),
    })),
  ),
  () => true,
);
export default MemomizedTabList;
