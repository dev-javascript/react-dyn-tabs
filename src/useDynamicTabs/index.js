import useDynamicTabs from './useDynamicTabs.js';
import CreateDefaultOptions from './createDefaultOptions.js';
import DefaultTabInnerComponent from '../tab/defaulTabInner.js';
new (CreateDefaultOptions)(useDynamicTabs, DefaultTabInnerComponent);
export default useDynamicTabs;