import React from 'react';
import {ApiContext} from '../utils/context.js';
import PropTypes from 'prop-types';
export default function TablistContainer(deps, props) {
  const {getTablistContainerProps} = deps(React.useContext(ApiContext));
  return <div {...getTablistContainerProps()}>{props.children}</div>;
}
TablistContainer.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
