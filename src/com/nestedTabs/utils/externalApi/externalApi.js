
import externalApi from './externalApi.factory';
import internalApi from '../internalApi';
export default externalApi.bind(null, { internalApi });


