import externalApiFactory from './externalApi.factory';
import getInternalApiInstance from '../internalApiInstance';
export default function (param = {}) {
    const { options } = param;
    const externalApi = externalApiFactory({ internalApiInstance: getInternalApiInstance(options) });
    return new externalApi();
};

