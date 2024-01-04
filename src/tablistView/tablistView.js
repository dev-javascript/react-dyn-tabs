import TablistView from './tablistView.factory.js';
export default TablistView.bind(undefined, (api) => ({
  tablistViewPropsGenerator: () => api.tablistViewPropsGenerator(),
}));
