import React, {useState, useRef, useLayoutEffect} from 'react';
import {ForceUpdateContext, StateContext} from '../../../utils/context.js';
export default function (getDeps, props) {
  const {
    ctx,
    ctx: {
      optionsManager: {
        options,
        setting: {Tabs, showMoreButtonClass, showMorePopperClass, showMoreContainerButtonClass},
      },
    },
  } = props;
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

  const ButtonComponent = options.showMoreTabsButtonComponent || Button;
  return (
    <div ref={ins.btnRef} style={ins.btnStyle} className={showMoreContainerButtonClass}>
      <ButtonComponent
        hiddenTabIDs={hiddenTabIDs}
        instance={ctx.userProxy}
        Tabs={Tabs}
        buttonClassName={showMoreButtonClass}
        popperClassName={showMorePopperClass}
      />
    </div>
  );
}
