import {forwardRef} from 'react';
import createPopper from '../createPopper.js';
import getPopperMaxHeight from '../getPopperMaxHeight.js';
import Popper from './popper.js';
const clk = (e) => {
  e.nativeEvent.stopImmediatePropagation();
};
const getDeps = () => ({
  createPopper,
  getPopperMaxHeight,
  clk,
});
export default forwardRef(Popper.bind(null, getDeps));
