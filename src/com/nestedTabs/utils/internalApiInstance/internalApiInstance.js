import renderedComponent from '../renderedComponent.js';
import optionManager from '../optionManager';
import internalApi from './internalApi.factory';
import getInstance from '../getInstance';
export default function (param = {}) {
    const { options } = param;
    return getInstance(internalApi, {
        renderedComponent: new (renderedComponent)(),
        optionManager: new (optionManager)(options)
    }, param);
};
// internalApi.bind(null, {
//     renderedComponent: new (renderedComponent)(),
//     optionManager: new (optionManager)()
// });