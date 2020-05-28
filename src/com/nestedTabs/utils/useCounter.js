import { useRef } from 'react';
const useCounter = function () {
    const ref = useRef(0);
    ref.current++;
    return [ref.current === 1, ref.current];
};
export default useCounter;