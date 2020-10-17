import factory from './tabPropsManager.factory';
import getLiProps from './liProps';
import getDefaultTabProps from './defaultTabProps';
import getUserTabProps from './getUserTabProps';
const tabPropsManager = new factory({ getLiProps, getDefaultTabProps, getUserTabProps });
export default tabPropsManager;