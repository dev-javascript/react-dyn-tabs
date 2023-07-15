import React from 'react';
import {ApiContext} from '../utils/context.js';
export default function TablistContainer(props) {
  const _className = React.useContext(ApiContext).optionsManager.setting.tablistContainerClass;
  return <div className={_className}>{props.children}</div>;
}
