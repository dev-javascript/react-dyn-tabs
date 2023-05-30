import React, {useCallback, memo, useEffect} from 'react';
export default memo(function (props) {
  const {instance, hiddenTabIDs} = props;
  const clk = useCallback(
    (e) => {
      if (hiddenTabIDs && hiddenTabIDs.length) {
      }
    },
    [instance, hiddenTabIDs],
  );
  return <button onClick={clk}>more</button>;
});
