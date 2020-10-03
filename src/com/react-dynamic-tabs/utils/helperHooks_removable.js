// import { useRef } from 'react';
// const useCounter = function () {
//     const ref = useRef(0);
//     ref.current++;
//     return [ref.current === 1, ref.current];
// };
// const useOldActiveId = function (activeId) {
//     const ref = useRef({
//         oldActiveId: activeId,
//         newActiveId: activeId,
//         updateOldActiveId: function () { ref.current.oldActiveId = ref.current.newActiveId; }
//     });
//     ref.current.newActiveId = activeId;
//     return ref.current;
// };
// export { useCounter, useOldActiveId };