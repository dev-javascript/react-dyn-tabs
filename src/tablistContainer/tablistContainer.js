import React from 'react';
import {ApiContext} from '../utils/context.js';
export default function TablistContainer(props) {
  const {
    options: {isVertical},
    setting: {tablistContainerClass, verticalClass},
  } = React.useContext(ApiContext).optionsManager;

  let _className = tablistContainerClass;
  if (isVertical) {
    _className += ' ' + verticalClass;
  }
  return <div className={_className}>{props.children}</div>;
}
