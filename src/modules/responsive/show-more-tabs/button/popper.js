import React, {forwardRef, useEffect} from 'react';
import {Tabs} from '../../../../tabList/tabList.js';
export default forwardRef(function Popper(props, ref) {
  const {instance, hiddenTabIDs, open} = props;
  let style = {
    opacity: 0,
    zIndex: -1,
    pointerEvent: 'none',
  };
  if (open == true) {
    style = {
      opacity: 1,
      zIndex: 3,
      pointerEvent: 'all',
    };
  }
  const {selectedTabID} = instance.getData();
  const openedTabIDs = hiddenTabIDs ? hiddenTabIDs.split(',') : [];
  return (
    <div ref={ref} style={{background: 'white', border: '1px solid lightgray', padding: '5px', ...style}}>
      <div data-popper-arrow></div>
      <Tabs
        selectedTabID={selectedTabID}
        openTabIDs={openedTabIDs}
        dir={instance.getOption('direction')}
        isVertical={true}
      />
    </div>
  );
});
