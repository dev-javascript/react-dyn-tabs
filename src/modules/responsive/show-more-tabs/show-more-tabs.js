import React, {useState, useRef, useLayoutEffect} from 'react';
import {ForceUpdateContext} from '../../../utils/context.js';
export default function (getDeps, props) {
  const {ctx} = props;
  React.useContext(ForceUpdateContext);
  const [hiddenTabIDs, setHiddenTabIDs] = useState('');
  const {getInstance, resizeDetectorIns, Button} = getDeps();
  const ref = useRef();
  ref.current = ref.current || getInstance(ctx, setHiddenTabIDs);
  useLayoutEffect(() => {
    ref.current.installResizer(resizeDetectorIns);
    return () => {
      ref.current.uninstallResizer(resizeDetectorIns);
    };
  }, [ref.current.btnRef]);
  const ButtonComponent = ctx.optionsManager.options.showMoreTabsButtonComponent || Button;
  return (
    <div ref={ref.current.btnRef} style={ref.current.btnStyle}>
      <ButtonComponent hiddenTabIDs={hiddenTabIDs} instance={ctx.userProxy} />
    </div>
  );
}
