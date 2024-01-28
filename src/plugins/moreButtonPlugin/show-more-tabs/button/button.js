import React, {useState, useCallback, useRef, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
export default function Button(getDeps, props) {
  const {popupContainerID} = props;
  const {Popper} = getDeps();
  const [open, setOpen] = useState(false);
  const btnRef = useRef();
  const popperRef = useRef();
  const ref = useRef();
  ref.current = ref.current || {
    closePopper: () => setOpen(false),
  };
  useEffect(() => {
    const close = () => setOpen(false);
    props.instance.on('onSelect', close);
    return () => {
      props.instance && props.instance.off && props.instance.off('onSelect', close);
    };
  }, []);
  useLayoutEffect(() => {
    if (btnRef.current && props.instance.getOption('accessibility')) {
      if (open) {
        btnRef.current.setAttribute('aria-expanded', true);
        btnRef.current.setAttribute('aria-controls', popupContainerID);
      } else {
        btnRef.current.setAttribute('aria-expanded', false);
        btnRef.current.removeAttribute('aria-controls');
      }
    }
  }, [open, btnRef.current]);
  const onClick = useCallback(
    (ev) => {
      ev.stopPropagation();
      window.document.removeEventListener('click', ref.current.closePopper, {once: true});
      window.document.addEventListener('click', ref.current.closePopper, {once: true});
      setOpen(!open);
      return () => {
        window.document.removeEventListener('click', ref.current.closePopper, {once: true});
      };
    },
    [open],
  );
  return (
    <>
      <div onClick={onClick} ref={btnRef} className={props.buttonClassName} {...props.btnAriaProps}>
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" title="More tabs">
          <path
            fill="gray"
            d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
          />
        </svg>
      </div>
      {open ? (
        <Popper
          {...props}
          ref={popperRef}
          btnRef={btnRef}
          className={props.popperClassName}
          popupContainerID={props.popupContainerID}
        />
      ) : null}
    </>
  );
}
Button.propTypes /* remove-proptypes */ = {
  buttonClassName: PropTypes.string,
  popperClassName: PropTypes.string,
  instance: PropTypes.object,
  hiddenTabIDs: PropTypes.string,
  TabsComponent: PropTypes.func,
  popupContainerID: PropTypes.string,
  btnAriaProps: PropTypes.object,
};
