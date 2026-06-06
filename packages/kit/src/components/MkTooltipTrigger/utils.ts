import { unref } from 'vue';
import { isArray } from '@magic/kit/utils';

import type { Trigger, TriggerType } from './types';

import type { MaybeRef } from 'vue';

export const isTriggerType = (trigger: Trigger | Trigger[], type: TriggerType) => {
  if (isArray(trigger)) {
    return trigger.includes(type);
  }
  return trigger === type;
};

export const whenTrigger = (
  trigger: MaybeRef<Trigger>,
  type: TriggerType,
  handler: (e: Event) => void
) => {
  return (e: Event) => {
    if (isTriggerType(unref(trigger), type)) {
      handler(e);
    }
  };
};
