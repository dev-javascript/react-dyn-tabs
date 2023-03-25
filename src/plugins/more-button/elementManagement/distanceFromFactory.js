import ElsFactory from './els-factory.js';
import Els from './els.js';
import {constructor, methods} from './distanceFrom.js';
constructor.prototype = Object.create(Els.prototype);
Object.assign(constructor.prototype, methods).constructor = constructor;
export default constructor.bind(null, {
  Base: function () {
    ElsFactory.apply(this, arguments);
  },
});
