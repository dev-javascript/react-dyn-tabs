import React, {forwardRef, useLayoutEffect} from 'react';
export default function Popper(getDeps, props, popperRef) {
  const {Tabs, createPopper, getPopperMaxHeight, clk} = getDeps();
  const {instance, hiddenTabIDs, btnRef} = props;
  useLayoutEffect(() => {
    popperRef.current.style.maxHeight = getPopperMaxHeight(btnRef.current, 15) + 'px';
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
          overflow: 'auto',
        }}
        className="show-more-tabs-container">
        <Tabs
          selectedTabID={selectedTabID}
          openTabIDs={openedTabIDs}
          dir={instance.getOption('direction')}
          isVertical={true}
        />
      </div>
    </>
  );
}
