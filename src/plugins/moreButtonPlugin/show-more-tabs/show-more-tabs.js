import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
export default function ShowMoreTabs(getDeps, props) {
  const {
    components,
    components: { useRootState, useForceUpdate },
    ctx
  } = props;
  useForceUpdate();
  const { openTabIDs, selectedTabID } = useRootState();
  const [hiddenTabIDs, setHiddenTabIDs] = useState('');
  const { getInstance, resizeDetectorIns } = getDeps();
  const ref = useRef();
  ref.current = ref.current || { ins: getInstance(ctx, setHiddenTabIDs) };
  const ins = ref.current.ins;
  const openTabIDsString = openTabIDs.toString();
  useLayoutEffect(() => {
    ins.setEls();
  }, []);
  useLayoutEffect(() => {
    ins.installResizer(resizeDetectorIns);
    return () => {
      ins.uninstallResizer(resizeDetectorIns);
    };
  }, []);
  useLayoutEffect(() => {
    ins.resize();
  }, [openTabIDsString, selectedTabID]);

  const ButtonComponent = ctx.optionsManager.options.moreButtonPlugin_buttonComponent;
  return (
    <div {...ins.btnContainerPropsGenerator()}>
      <ButtonComponent {...ins.btnPropsGenerator(hiddenTabIDs, components)} />
    </div>
  );
}
ShowMoreTabs.propTypes /* remove-proptypes */ = {
  ctx: PropTypes.object,
  contexts: PropTypes.object,
  components: PropTypes.object,
};
