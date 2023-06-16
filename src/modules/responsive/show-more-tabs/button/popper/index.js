import {Tabs} from '../../../../../tabList/tabList.js';
import createPopper from '../createPopper.js';
import getPopperMaxHeight from '../getPopperMaxHeight.js';
import Popper from './popper';
const clk = (e) => {
  e.nativeEvent.stopImmediatePropagation();
};
const getDeps = () => ({
  Tabs,
  createPopper,
  getPopperMaxHeight,
  clk,
});
export default Popper.bind(null, getDeps);
