import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
export default function Button(getDeps, props) {
  const { Popper, Api } = getDeps();
  const [open, setOpen] = useState(false);
  const closePopper = useCallback(() => setOpen(false), []);
  const btnRef = useRef();
  const ref = useRef();
  props.components.useForceUpdate();
  ref.current = ref.current || Api.call(props.instance, props.components);
  useEffect(() => {
    const close = () => setOpen(false);
    props.instance.on('onSelect', close);
    return () => {
      props.instance && props.instance.off && props.instance.off('onSelect', close);
    };
  }, []);
  const onClick = useCallback(
    (ev) => {
      ev.stopPropagation();
      window.document.removeEventListener('click', closePopper, { once: true });
      window.document.addEventListener('click', closePopper, { once: true });
      setOpen(!open);
      return () => {
        window.document.removeEventListener('click', closePopper, { once: true });
      };
    },
    [open],
  );
  const IconComponent = props.instance.optionsManager.options.moreButtonPlugin_iconComponent;
  return (
    <>
      <div {...ref.current.btnPropsGenerator(onClick, btnRef, open)}>
        <IconComponent instance={props.instance} />
      </div>
      {open ? <Popper {...props} TabsComponent={ref.current.TabsComponent} btnRef={btnRef} /> : null}
    </>
  );
}
Button.propTypes /* remove-proptypes */ = {
  instance: PropTypes.object,
  hiddenTabIDs: PropTypes.string,
  components: PropTypes.object,
};
