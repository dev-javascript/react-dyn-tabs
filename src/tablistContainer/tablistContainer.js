import React from 'react';
import {ApiContext} from '../utils/context.js';
export default function TablistContainer(props) {
  const api = React.useContext(ApiContext);
  let _className = '';
  const {
    options: {isVertical},
    setting: {tablistContainerClass, verticalClass},
  } = api.optionsManager;
  _className = tablistContainerClass;
  if (isVertical) {
    _className += ' ' + verticalClass;
  }
  return <div className={_className}>{props.children}</div>;
}
