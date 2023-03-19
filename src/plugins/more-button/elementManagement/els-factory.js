import El from './el.js';
import Els from './els.js';
export default Els.bind(undefined, {
  geElInstance: function () {
    return new (Function.prototype.bind.apply(El, arguments))();
  },
});
