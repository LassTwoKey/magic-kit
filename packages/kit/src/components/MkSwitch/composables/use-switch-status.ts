import { computed, ref, toRaw } from 'vue';
import { isArray, isBoolean, isObject, isPropAbsent } from '@magic/kit/utils';
import { isEqual } from 'lodash-es';

import type { Props } from '../api';
import type { ModelValue } from '../types';

import type { Slots, WritableComputedRef } from 'vue';

export const useSwitchStatus = (
  props: Props,
  slots: Slots,
  { model }: { model: WritableComputedRef<ModelValue | ModelValue[] | undefined> }
) => {
  const isFocused = ref(false);

  const actualValue = computed(() => {
    return props.value;
  });

  const isChecked = computed(() => {
    const value = model.value;
    if (isBoolean(value)) {
      return value;
    } else if (isArray(value)) {
      if (isObject(actualValue.value)) {
        return value.map(toRaw).some((o) => isEqual(o, actualValue.value));
      } else {
        return value.map(toRaw).includes(actualValue.value as ModelValue);
      }
    } else if (value !== null && value !== undefined) {
      return value === props.trueValue;
    } else {
      return !!value;
    }
  });

  const hasOwnLabel = computed(() => {
    return !!slots.default || !isPropAbsent(props.label);
  });

  return {
    isChecked,
    isFocused,
    hasOwnLabel,
    actualValue,
  };
};
