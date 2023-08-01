import {memo} from 'react';
import Popper from './popper';
import Button from './button';
const getDeps = () => ({Popper});
export default memo(Button.bind(null, getDeps));
