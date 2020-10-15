import getCustomTabTitleProps from './getCustomTabTitleProps';
import getDefaultTabTitleProps from './getDefaultTabTitleProps';
export default function ({ isCustomComponent, id, isSelected }) {
    return isCustomComponent ? getCustomTabTitleProps.call(this, { id, isSelected }) :
        getDefaultTabTitleProps.call(this, { id, isSelected });
};