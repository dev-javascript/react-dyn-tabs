var elementResizeDetectorMaker = require('element-resize-detector');
var resizerIns = elementResizeDetectorMaker({
  strategy: 'scroll',
  callOnAdd: false,
});
const originalListenTo = resizerIns.listenTo;
resizerIns.listenTo = function (el, callback, op = {delay: 50}) {
  let __onResize;
  originalListenTo.call(resizerIns, el, (el) => {
    clearTimeout(__onResize);
    __onResize = setTimeout(() => {
      callback(el);
    }, op.delay);
  });
};
export default resizerIns;
