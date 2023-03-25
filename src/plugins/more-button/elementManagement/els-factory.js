import El from './el.js';
import Els from './els.js';
export default function () {
  return Function.prototype.bind.apply(Els, [this || null, {geElInstance: (op) => new El(op)}, ...arguments])();
}
