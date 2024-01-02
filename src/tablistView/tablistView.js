import TablistView from './tablistView.factory.js';
export default TablistView.bind(undefined, (api) => ({getTablistViewProps: () => api.getTablistViewProps()}));
