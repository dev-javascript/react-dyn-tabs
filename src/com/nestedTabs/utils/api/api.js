import apiFactory from './api.factory';
import OptionManager from '../optionManager';
import renderedComponent from '../renderedComponent.js';
import { actions } from '../stateManagement';
import baseApi from './baseApi.js';

export default function (param = {}) {
    const { options } = param,
        optionManagerInstance = new (OptionManager)({ options });
    const externalApi = apiFactory({
        renderedComponentInstance: new (renderedComponent)(optionManagerInstance.getActiveTab()),
        baseApiInstance: new baseApi(),
        actions,
        optionManagerInstance
    });
    return new externalApi();
};

