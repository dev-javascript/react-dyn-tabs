import React from 'react';
const DefaulTabInner = function (props) {
  return (
    <button {...props.tabProps}>
      {props.children}
      {props.hasOwnProperty('iconProps') && <span {...props.iconProps}></span>}
    </button>
  );
};
export default DefaulTabInner;
