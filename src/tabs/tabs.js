import {forwardRef} from 'react';
import tablistPropsManager from './tablistPropsManager.js';
import Tabs from './tabs.factory.js';
export default forwardRef(Tabs.bind(undefined, () => ({tablistPropsManager})));
