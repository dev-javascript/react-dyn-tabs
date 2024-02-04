import createPopper from './createPopper.js';
import getPopperMaxHeight from './getPopperMaxHeight.js';
import getClassName from './getClassName.js';
import Popper from './popper.js';
const clk = (e) => {
  e.nativeEvent.stopImmediatePropagation();
};
const getDeps = () => ({
  createPopper,
  getPopperMaxHeight,
  getClassName,
  clk,
});
export default Popper.bind(null, getDeps);
