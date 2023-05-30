import React, {useRef, useLayoutEffect} from 'react';
export default function (getDeps, props) {
  const {ctx} = props;
  const {btnRef, getInstance, resizeDetectorIns, Button} = getDeps();
  const ref = useRef();
  ref.current = ref.current || getInstance(ctx);
  useLayoutEffect(() => {
    ref.current.installResizer(resizeDetectorIns);
    return () => {
      ref.current.uninstallResizer(resizeDetectorIns);
    };
  }, [btnRef.current]);

  return (
    <Button ref={btnRef} style={ref.current.btnStyle}>
      more
    </Button>
  );
}
