import React, {useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
export default function Popper(getDeps, props, popperRef) {
  const {createPopper, getPopperMaxHeight, getClassName, clk} = getDeps();
  const {TabsComponent, instance, hiddenTabIDs, btnRef} = props;
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
      <div onClick={clk} ref={popperRef} className={getClassName(instance)}>
        <TabsComponent
          selectedTabID={selectedTabID}
          openTabIDs={openedTabIDs}
          dir={instance.getOption('direction')}
          isVertical={true}
        />
      </div>
    </>
  );
}
Popper.propTypes /* remove-proptypes */ = {
  hiddenTabIDs: PropTypes.string,
  instance: PropTypes.object,
  btnRef: PropTypes.object,
  TabsComponent: PropTypes.func,
};
