import React, {memo} from 'react';
import ElManagement from '../elementManagement/index.js';
import Api from './api.js';
import Button from './button/index.js';
import resizeDetectorIns from './element-resize-detector-adapter.js';
import ShowMoreTabs from './show-more-tabs.js';
const getDeps = () => {
  return {
    Button,
    resizeDetectorIns,
    getInstance: (ctx, setHiddenTabIDs) =>
      new Api({
        setHiddenTabIDs,
        btnRef: React.createRef(),
        getElManagementIns: (param) => new ElManagement(param),
        ctx,
      }),
  };
};
export default memo(ShowMoreTabs.bind(null, getDeps), () => true);
