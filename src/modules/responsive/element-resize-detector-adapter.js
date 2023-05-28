var elementResizeDetectorMaker = require('element-resize-detector');
var resizerIns = elementResizeDetectorMaker({
  strategy: 'scroll',
  callOnAdd: true,
});
export default resizerIns;
