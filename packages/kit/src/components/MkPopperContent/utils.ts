import { isClient } from '@magic/kit/utils';
import { unrefElement, MaybeComputedElementRef } from '@vueuse/core';

import type { Props } from './api';
import type { PopperOptions } from './type';

import type { Modifier } from '@popperjs/core';

export const buildPopperOptions = (props: Props, modifiers: PopperOptions['modifiers']) => {
  const { placement, strategy, popperOptions } = props;

  const options = {
    ...popperOptions,
    placement,
    strategy,
    modifiers: [...genModifiers(props), ...modifiers],
  };

  deriveExtraModifiers(options, popperOptions?.modifiers);
  return options;
};

export const unwrapMeasurableEl = ($el: MaybeComputedElementRef) => {
  if (!isClient) return;
  return unrefElement($el);
};

function genModifiers(options: Props) {
  const { offset, gpuAcceleration, fallbackPlacements } = options;
  return [
    {
      name: 'offset',
      options: {
        offset: [0, offset ?? 12],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
    },
    {
      name: 'flip',
      options: {
        padding: 5,
        fallbackPlacements,
      },
    },
    {
      name: 'computeStyles',
      options: {
        gpuAcceleration,
      },
    },
  ];
}

function deriveExtraModifiers(
  options: { modifiers: Partial<Modifier<string, object>>[] },
  modifiers?: PopperOptions['modifiers']
): void {
  if (modifiers) {
    options.modifiers = [...options.modifiers, ...(modifiers ?? [])];
  }
}
