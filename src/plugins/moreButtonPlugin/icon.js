import React from 'react';
import PropTypes from 'prop-types';
export default function MoreButtonPlugin_iconComponent(props) {
    const style = {};
    if (props.instance.optionsManager.options.direction === 'rtl') {
        style.transform = 'rotate(180deg)';
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" title="More tabs" style={style}>
            <path
                fill="gray"
                d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
            />
        </svg>
    );
}
MoreButtonPlugin_iconComponent.propTypes /* remove-proptypes */ = {
    instance: PropTypes.object,
};