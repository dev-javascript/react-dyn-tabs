import React, {useState, useRef, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
export default function ShowMoreTabs(getDeps, props) {
  const {
    components: {Tabs: TabsComponent, useRootState, useForceUpdate},
    ctx,
    ctx: {
      optionsManager: {options},
    },
  } = props;
  useForceUpdate();
  const {openTabIDs, selectedTabID} = useRootState();
  const [hiddenTabIDs, setHiddenTabIDs] = useState('');
  const {getInstance, resizeDetectorIns, Button} = getDeps();
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

  const ButtonComponent =
    options.showMoreButtonComponent && typeof options.showMoreButtonComponent === 'function'
      ? options.showMoreButtonComponent
      : Button;
  return (
    <div {...ins.btnContainerPropsGenerator()}>
      <ButtonComponent {...ins.btnPropsGenerator(hiddenTabIDs, TabsComponent, options.accessibility)} />
    </div>
  );
}
ShowMoreTabs.propTypes /* remove-proptypes */ = {
  ctx: PropTypes.object,
  contexts: PropTypes.object,
  TabsComponent: PropTypes.func,
};
