import {memo} from 'react';
import Popper from './popper';
import Button from './button';
import Api from './api.js';

export default (deps = {}) => {
  const getDeps = () => ({Popper, Api, ...deps});
  return memo(Button.bind(null, getDeps));
};
