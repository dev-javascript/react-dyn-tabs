import React, {useState, useCallback, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
export default function Button(getDeps, props) {
  const {Popper, Api, ctx, components} = getDeps();
  const [open, setOpen] = useState(false);
  const btnRef = useRef();
  const ref = useRef();
  components.useForceUpdate();
  ref.current = ref.current || Api.call(ctx, components, setOpen);

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
  const IconComponent = ctx.getOption('moreButtonPlugin_iconComponent');
  return (
    <>
      <div {...ref.current.btnPropsGenerator(onClick, btnRef, open)}>
        <IconComponent instance={props.instance} />
      </div>
      {open ? <Popper {...props} instance={ctx} TabsComponent={ref.current.TabsComponent} btnRef={btnRef} /> : null}
    </>
  );
}
Button.propTypes /* remove-proptypes */ = {
  instance: PropTypes.object,
  hiddenTabIDs: PropTypes.string,
};
