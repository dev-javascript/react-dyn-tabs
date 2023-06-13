//import {createPopper} from '@popperjs/core';
import {createPopper} from '@popperjs/core/lib/popper-lite';
import flip from '@popperjs/core/lib/modifiers/flip';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
preventOverflow.options = {padding: 8};
export default function (ref, popper) {
  return createPopper(ref, popper, {
    placement: 'bottom',
    strategy: 'fixed',
    modifiers: [
      flip,
      preventOverflow,
      // {
      //   name: 'preventOverflow',
      //   options: {
      //     padding: 8,
      //   },
      // },
      // {
      //   name: 'flip',
      //   enabled: true,
      // },
      // {
      //   name: 'arrow',
      //   options: {
      //     element: '[data-popper-arrow]',
      //     padding: 5,
      //   },
      // },
      // {
      //   name: 'offset',
      //   options: {
      //     offset: [0, 5],
      //   },
      // },
    ],
  });
}
