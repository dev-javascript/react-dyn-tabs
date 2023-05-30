import React, {memo} from 'react';
import ElManagement from '../elementManagement/index.js';
import Api from './api.js';
import Button from './button.js';
import resizeDetectorIns from '../element-resize-detector-adapter.js';
import ShowMoreTabs from './show-more-tabs.js';
const getDeps = () => {
  const btnRef = React.createRef();
  return {
    Button,
    btnRef,
    resizeDetectorIns,
    getInstance: (ctx) => new Api({getElManagementIns: (param) => new ElManagement(param), ctx, btnRef}),
  };
};
export default memo(ShowMoreTabs.bind(null, getDeps), () => true);
