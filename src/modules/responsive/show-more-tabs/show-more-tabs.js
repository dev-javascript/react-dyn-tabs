import React, {useState, useRef, useLayoutEffect} from 'react';
import {ForceUpdateContext, StateContext} from '../../../utils/context.js';
export default function (getDeps, props) {
  const {ctx} = props;
  React.useContext(ForceUpdateContext);
  const {openTabIDs, selectedTabID} = React.useContext(StateContext);
  const [hiddenTabIDs, setHiddenTabIDs] = useState('');
  const {getInstance, resizeDetectorIns, Button} = getDeps();
  const ref = useRef();
  ref.current = ref.current || {ins: getInstance(ctx, setHiddenTabIDs)};
  const ins = ref.current.ins;
  const openTabIDsString = openTabIDs.toString();
  useLayoutEffect(() => {
    ins.installResizer(resizeDetectorIns);
    return () => {
      ins.uninstallResizer(resizeDetectorIns);
    };
  }, [ins.btnRef]);
  useLayoutEffect(() => {
    ins.resize();
  }, [openTabIDsString, selectedTabID]);

  const ButtonComponent = ctx.optionsManager.options.showMoreTabsButtonComponent || Button;
  return (
    <div ref={ins.btnRef} style={ins.btnStyle}>
      <ButtonComponent hiddenTabIDs={hiddenTabIDs} instance={ctx.userProxy} Tabs={ctx.optionsManager.setting.Tabs} />
    </div>
  );
}
