
import renderedComponent from '../renderedComponent.js';
import optionManager from '../optionManager';
import factory from './internalApi.factory';
export default factory({
    renderedComponent: new (renderedComponent)(),
    optionManager: new (optionManager)()
});