import factory from './tabPropsManager.factory';
import tabProps from './tabProps';
import defaultTabInnerProps from './defaultTabInnerProps';
import userTabInnerProps from './userTabInnerProps';
const tabPropsManager = new factory({ tabProps, defaultTabInnerProps, userTabInnerProps });
export default tabPropsManager;