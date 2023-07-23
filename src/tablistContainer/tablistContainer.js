import React from 'react';
import {ApiContext} from '../utils/context.js';
import PropTypes from 'prop-types';
export default function TablistContainer(props) {
  const _className = React.useContext(ApiContext).optionsManager.setting.tablistContainerClass;
  return <div className={_className}>{props.children}</div>;
}
TablistContainer.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
