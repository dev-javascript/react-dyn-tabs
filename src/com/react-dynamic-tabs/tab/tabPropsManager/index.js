import factory from './tabPropsManager.factory';
import tabProps from './tabProps';
import defaultTabInnerProps from './defaultTabInnerProps';
import userTabInnerProps from './userTabInnerProps';
import tabCloseIconProps from './tabcloseIconProps.js';
const tabPropsManager = new factory({ tabProps, defaultTabInnerProps, userTabInnerProps, tabCloseIconProps });
export default tabPropsManager;