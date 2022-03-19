import {VirtualizorConstructor, VirtualizorMethods} from './virtualizor.js';
import resizeDetectorIns from '../../../adapters/resize-detector-adapter/index.js';
import Main from '../basic/basic.js';
Object.assign(VirtualizorConstructor.prototype, Main.prototype, VirtualizorMethods);
export default VirtualizorConstructor.bind(null, {resizeDetectorIns, Main});
