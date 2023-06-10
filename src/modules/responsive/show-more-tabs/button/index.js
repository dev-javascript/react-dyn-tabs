import React, {useState, useCallback, memo, useRef, useEffect} from 'react';
import {createPopper} from '@popperjs/core';
import Popper from './popper';
export default memo(function (props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef();
  const popperRef = useRef();
  const clk = useCallback(
    (e) => {
      const _open = !open;
      window.document.addEventListener(
        'click',
        () => {
          setOpen(!_open);
        },
        {once: true},
      );
      setOpen(_open);
    },
    [open],
  );
  useEffect(() => {
    let popperIns;
    popperRef.current &&
      btnRef.current &&
      (popperIns = createPopper(btnRef.current, popperRef.current, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'flip',
            enabled: true,
          },
          {
            name: 'arrow',
            options: {
              element: '[data-popper-arrow]',
              padding: 5,
            },
          },
          {
            name: 'offset',
            options: {
              offset: [0, 5],
            },
          },
        ],
      }));
    return () => popperIns.destroy();
  }, [btnRef, popperRef]);
  return (
    <>
      <button onClick={clk} ref={btnRef}>
        more
      </button>
      <Popper {...props} open={open} ref={popperRef} />
    </>
  );
});
