import React, {forwardRef, useLayoutEffect} from 'react';
import {Tabs} from '../../../../tabList/tabList.js';
import createPopper from './createPopper.js';
const clk = (e) => {
  e.nativeEvent.stopImmediatePropagation();
};
export default forwardRef(function Popper(props, popperRef) {
  const {instance, hiddenTabIDs, btnRef} = props;
  useLayoutEffect(() => {
    const popperIns = createPopper(btnRef.current, popperRef.current);
    return () => {
      popperIns.destroy();
    };
  }, []);
  const {selectedTabID} = instance.getData();
  const openedTabIDs = hiddenTabIDs ? hiddenTabIDs.split(',') : [];
  return (
    <>
      <div
        onClick={clk}
        ref={popperRef}
        style={{
          position: 'fixed',
          background: 'white',
          border: '1px solid lightgray',
          padding: '0px',
          zIndex: 2,
        }}>
        <Tabs
          selectedTabID={selectedTabID}
          openTabIDs={openedTabIDs}
          dir={instance.getOption('direction')}
          isVertical={true}
        />
      </div>
    </>
  );
});
