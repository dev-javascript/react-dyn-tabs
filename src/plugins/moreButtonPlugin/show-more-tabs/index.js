import React from 'react';
import Api from './api.js';
import getResizeDetectorIns from './element-resize-detector-adapter.js';
import tabsMoreButton from 'tabs-more-button';
import ShowMoreTabs from './show-more-tabs.js';
const getDeps = () => {
  return {
    getResizeDetectorIns,
    getInstance: (ctx, setHiddenTabIDs) =>
      new Api({
        setHiddenTabIDs,
        btnRef: React.createRef(),
        getResizerIns: function (options) {
          return new (Function.prototype.bind.apply(tabsMoreButton))(options);
        },
        ctx,
      }),
  };
};
export default ShowMoreTabs.bind(null, getDeps);
