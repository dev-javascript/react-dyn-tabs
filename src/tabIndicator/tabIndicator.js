import React, {memo, useContext} from 'react';
import {ApiContext, ForceUpdateContext} from '../utils/context.js';
function TabIndicator() {
  useContext(ForceUpdateContext);
  const api = useContext(ApiContext),
    _optionsManager = api.optionsManager,
    {enableTabIndicator} = _optionsManager.options,
    {tabIndicatorClass} = _optionsManager.setting;
  if (enableTabIndicator) {
    return <div className={tabIndicatorClass}></div>;
  } else {
    return null;
  }
}
const MemoizedTabIndicator = memo(TabIndicator, () => true);
export default MemoizedTabIndicator;
