import React from 'react';
const DefaulTabInner = function (props) {
  return (
    <button {...props.tabProps}>
      {props.children}
      {Object.prototype.hasOwnProperty.call(props, 'iconProps') && <span {...props.iconProps}></span>}
    </button>
  );
};
export default DefaulTabInner;
