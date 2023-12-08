const elementResizeDetectorMaker = require('element-resize-detector');
const resizerIns = elementResizeDetectorMaker({
  strategy: 'scroll',
  callOnAdd: true,
});
resizerIns.debncListenTo = (el, callback) => {
  return resizerIns.listenTo(
    el,
    (function (func, wait) {
      let timeout;
      return function (...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    })(callback, 10),
  );
};

export default resizerIns;
