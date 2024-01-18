import React from 'react';
import {ApiContext} from '../context.js';
import PropTypes from 'prop-types';
export default function TablistContainer(deps, props) {
  const {tablistContainerPropsManager} = deps(React.useContext(ApiContext));
  return <div {...tablistContainerPropsManager()}>{props.children}</div>;
}
TablistContainer.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
