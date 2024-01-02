import React from 'react';
import {ApiContext} from '../utils/context.js';
import PropTypes from 'prop-types';
export default function TablistView(deps, props) {
  const {getTablistViewProps} = deps(React.useContext(ApiContext));
  return <div {...getTablistViewProps()}>{props.children}</div>;
}
TablistView.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
