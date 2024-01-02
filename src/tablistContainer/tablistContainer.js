import TablistContainer from './tablistContainer.factory.js';
export default TablistContainer.bind(undefined, (api) => ({
  getTablistContainerProps: () => api.getTablistContainerProps(),
}));
