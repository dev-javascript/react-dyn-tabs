import elementResizeDetectorMaker from 'element-resize-detector';
const resizerIns = elementResizeDetectorMaker({
  strategy: 'scroll',
  callOnAdd: true,
});
const getRaf = () => {
  const w = window;
  return (
    w.requestAnimationFrame ||
    w.webkitRequestAnimationFrame ||
    w.mozRequestAnimationFrame ||
    w.oRequestAnimationFrame ||
    w.msRequestAnimationFrame ||
    function (callback) {
      w.setTimeout(callback, 1000 / 60);
    }
  );
};
resizerIns.debncListenTo = (el, callback) => {
  return resizerIns.listenTo(
    el,
    (function (func, wait) {
      let timeout;
      return function (...args) {
        const later = () => {
          clearTimeout(timeout);
          getRaf()(() => func(...args));
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    })(callback, 10),
  );
};

export default resizerIns;
