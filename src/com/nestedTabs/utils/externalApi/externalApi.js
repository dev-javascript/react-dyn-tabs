
import externalApiFactory from './externalApi.factory';
import internalApi from '../internalApi';
export default externalApiFactory({ internalApi: new internalApi() });


