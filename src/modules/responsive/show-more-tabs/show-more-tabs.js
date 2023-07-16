import React, {useState, useRef, useLayoutEffect} from 'react';
export default function (getDeps, props) {
  const {
    TabsComponent,
    ctx,
    contexts: {ForceUpdateContext, StateContext},
    ctx: {
      optionsManager: {
        options,
        setting: {showMoreButtonClass, showMorePopperClass, showMoreContainerClass, titleClass},
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

  const ButtonComponent = options.showMoreButtonComponent || Button;
  return (
    <div ref={ins.btnRef} className={showMoreContainerClass}>
      <ButtonComponent
        hiddenTabIDs={hiddenTabIDs}
        instance={ctx.userProxy}
        TabsComponent={TabsComponent}
        buttonClassName={titleClass + ' ' + showMoreButtonClass}
        popperClassName={showMorePopperClass}
      />
    </div>
  );
}
