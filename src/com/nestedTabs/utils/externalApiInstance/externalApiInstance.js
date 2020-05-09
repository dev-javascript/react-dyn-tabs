import externalApiFactory from './externalApi.factory';
import getInternalApiInstance from '../internalApiInstance';
import { actions } from '../stateManagement'
export default function (param = {}) {
    const { options } = param;
    const externalApi = externalApiFactory({
        internalApiInstance: getInternalApiInstance({ options }),
        actions
    });
    return new externalApi();
};

