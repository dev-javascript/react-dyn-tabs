import React, {memo} from 'react';
export default (TabComponent) =>
  memo(TabComponent, (oldProps, newProps) => {
    const {id, selectedTabID: oldActiveId} = oldProps,
      {selectedTabID: newActiveId} = newProps;
    return oldActiveId === newActiveId || (id !== oldActiveId && id !== newActiveId);
  });
