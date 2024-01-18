import {memo, forwardRef} from 'react';
import TabList from './tabList.factory.js';
import Tabs from '../tabs/tabs.js';
export const tablistPropsManager = function tablistPropsManager(ins, ref, state) {
  const {openTabIDs, selectedTabID} = state;
  return {
    openTabIDs,
    selectedTabID,
    ref,
    dir: ins.getOption('direction'),
    isVertical: ins.getOption('isVertical'),
  };
};
const MemomizedTabList = memo(
  forwardRef(
    TabList.bind(undefined, (ins) => ({
      Tabs,
      tablistPropsManager: (ref, state) => tablistPropsManager(ins, ref, state),
    })),
  ),
  () => true,
);
export default MemomizedTabList;
