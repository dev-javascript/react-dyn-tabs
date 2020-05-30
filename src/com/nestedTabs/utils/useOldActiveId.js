import { useRef } from 'react';
const useOldActiveId = function (activeId) {
    const ref = useRef({
        oldActiveId: activeId,
        newActiveId: activeId,
        updateOldActiveId: function () { ref.current.oldActiveId = ref.current.newActiveId; }
    });
    ref.current.newActiveId = activeId;
    return ref.current;
};
export default useOldActiveId;