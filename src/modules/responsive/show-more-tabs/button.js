import React, {forwardRef} from 'react';
export default forwardRef(function (props, ref) {
  return (
    <div ref={ref} {...props}>
      {props.children}
    </div>
  );
});
