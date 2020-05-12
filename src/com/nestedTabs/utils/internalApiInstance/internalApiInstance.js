import renderedComponent from '../renderedComponent.js';
import OptionManager from '../optionManager';
import internalApi from './internalApi.factory';
import getInstance from '../getInstance';
export default function (param = {}) {
    const { options } = param, optionManager = new (OptionManager)({ options });
    return getInstance(internalApi, {
        renderedComponent: new (renderedComponent)(optionManager.getActiveTab()),
        optionManager
    }, param);
};