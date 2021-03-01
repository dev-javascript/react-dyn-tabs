import { memo } from 'react';
const MemoPanel = memo(function (props) {
    return props.childComponent;
}, () => true);
export default MemoPanel;
