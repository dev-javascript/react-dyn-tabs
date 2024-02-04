import {memo} from 'react';
import Popper from './popper';
import Button from './button';
import Api from './api.js';
const getDeps = () => ({Popper, Api});
export default memo(Button.bind(null, getDeps));
