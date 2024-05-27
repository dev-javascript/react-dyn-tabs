import React, {useState, useRef, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
export default function ShowMoreTabs(getDeps, props) {
  const {ctx, openTabIDs, selectedTabID} = props;
  const [hiddenTabIDs, setHiddenTabIDs] = useState('');
  const {getInstance, resizeDetectorIns} = getDeps();
  const ref = useRef();
  ref.current = ref.current || {ins: getInstance(ctx, setHiddenTabIDs)};
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
  const ButtonComponent = ctx.getOption('moreButtonPlugin_buttonComponent');
  return (
    <div ref={ins.btnRef} className={ctx.getSetting('tabClass') + ' ' + ctx.getSetting('showMoreContainerClass')}>
      <ButtonComponent hiddenTabIDs={hiddenTabIDs} instance={ctx.userProxy} />
    </div>
  );
}
ShowMoreTabs.propTypes /* remove-proptypes */ = {
  ctx: PropTypes.object,
  openTabIDs: PropTypes.array,
  selectedTabID: PropTypes.string,
};
