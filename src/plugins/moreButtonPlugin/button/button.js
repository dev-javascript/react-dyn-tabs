import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
export default function Button(getDeps, props) {
  const {Popper, Api} = getDeps();
  const [open, setOpen] = useState(false);
  const btnRef = useRef();
  const ref = useRef();
  props.components.useForceUpdate();
  ref.current = ref.current || Api.call(props.instance, props.components, setOpen);

  const onClick = useCallback(
    (ev) => {
      ref.current.onButtonClick(ev, open);
    },
    [open],
  );
  useEffect(() => {
    ref.current.onMount();
    return () => {
      ref?.current && ref.current.onDestroy && ref.current.onDestroy();
    };
  }, []);

  const IconComponent = props.instance.optionsManager.options.moreButtonPlugin_iconComponent;
  return (
    <>
      <div {...ref.current.btnPropsGenerator(onClick, btnRef, open)}>
        <IconComponent instance={props.instance.userProxy} />
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
