import {forwardRef} from 'react';
import Tabs from './tabs.factory.js';
import Tab from '../tab/tab.js';
export const TabsPropsManager = function (ins, props) {
  const {dir, isVertical} = props;
  const result = {
    className: ins.getSetting('tablistClass') + ' ' + ins.getSetting(`${dir}Class`),
  };
  if (isVertical) {
    result.className += ' ' + ins.getSetting('verticalClass');
  }
  if (ins.getOption('accessibility')) {
    result.role = 'tablist';
  }
  if (props.tablistID) {
    result.id = props.tablistID;
  }
  return result;
};
export default forwardRef(
  Tabs.bind(undefined, (ins) => ({
    Tab,
    TabsPropsManager: (props) => TabsPropsManager(ins, props),
  })),
);
