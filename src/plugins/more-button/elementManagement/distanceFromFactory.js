import Els from './els-factory.js';
import {constructor, methods} from './distanceFrom.js';
constructor.prototype = Object.create(Els.prototype);
Object.assign(constructor.prototype, methods).constructor = constructor;
export default constructor.bind(null, function () {
  Els.apply(this, arguments);
});
