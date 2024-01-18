import React from 'react';
import {ApiContext} from '../context.js';
import PropTypes from 'prop-types';
export default function TablistView(deps, props) {
  const {tablistViewPropsManager} = deps(React.useContext(ApiContext));
  return <div {...tablistViewPropsManager()}>{props.children}</div>;
}
TablistView.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
