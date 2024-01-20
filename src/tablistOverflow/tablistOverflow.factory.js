import React from 'react';
import {useApi} from '../hooks.js';
import PropTypes from 'prop-types';

export default function TablistOverflow(deps, props) {
  const {tablistOverflowPropsManager} = deps(useApi());
  return <div {...tablistOverflowPropsManager()}>{props.children}</div>;
}
TablistOverflow.propTypes /* remove-proptypes */ = {
  children: PropTypes.element,
};
