
import renderedComponent from '../renderedComponent.js';
import optionManager from '../optionManager';
import internalApi from './internalApi.factory';
export default internalApi.bind(null, {
    renderedComponent: new (renderedComponent)(),
    optionManager: new (optionManager)()
});