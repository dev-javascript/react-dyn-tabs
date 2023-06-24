import React, {useState, useCallback, useRef, useEffect} from 'react';
export default function (getDeps, props) {
  const {Popper} = getDeps();
  const [open, setOpen] = useState(false);
  const btnRef = useRef();
  const popperRef = useRef();
  const ref = useRef();
  ref.current = ref.current || {
    closePopper: () => setOpen(false),
  };
  useEffect(() => {
    props.instance.on('onSelect', () => setOpen(false));
  }, []);
  const onClick = useCallback(() => {
    window.document.removeEventListener('click', ref.current.closePopper, {once: true});
    window.document.addEventListener('click', ref.current.closePopper, {once: true});
    setOpen(!open);
    return () => {
      window.document.removeEventListener('click', ref.current.closePopper, {once: true});
    };
  }, [open]);
  return (
    <>
      <button onClick={onClick} ref={btnRef} className={props.buttonClassName}>
        more
      </button>
      {open ? <Popper {...props} ref={popperRef} btnRef={btnRef} className={props.popperClassName} /> : null}
    </>
  );
}
