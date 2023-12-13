import React from 'react';
import {ApiContext} from '../utils/context.js';
import PropTypes from 'prop-types';
export default function TablistView(props) {
  const {
    options: {isVertical, direction},
    setting,
    setting: {tablistViewClass, verticalClass, responsiveClass},
  } = React.useContext(ApiContext).optionsManager;

  let _className = tablistViewClass + ' ' + setting[direction + 'Class'];
  if (isVertical) {
    _className += ' ' + verticalClass;
  }
  if (responsiveClass) {
    _className += ' ' + responsiveClass;
  }
  return <div className={_className}>{props.children}</div>;
}
TablistView.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
