import { computed, inject, ref, toRaw } from 'vue';
import { checkboxGroupContextKey } from '@magic/kit/constants';
import { useProp } from '@magic/kit/hooks';
import { isArray, isBoolean, isObject, isPropAbsent } from '@magic/kit/utils';
import { isEqual } from 'lodash-es';

import type { Props } from '../api';
import type { ModelValue } from '../types';
import type { CheckboxGroupContext } from './types';

import type { WritableComputedRef } from 'vue';
import type { Size } from '@magic/kit/types';

interface UseCheckboxStatusParams {
  model: WritableComputedRef<ModelValue | ModelValue[]>;
}

export const useCheckboxStatus = (props: Props, { model }: UseCheckboxStatusParams) => {
  const checkboxGroup = inject<CheckboxGroupContext | undefined>(
    checkboxGroupContextKey,
    undefined
  );
  const isFocused = ref(false);

  const actualValue = computed(() => props.value);

  const isChecked = computed<boolean>(() => {
    const value = model.value;
    if (isBoolean(value)) return value;
    if (isArray(value)) {
      if (value === undefined) return false;
      if (actualValue.value === undefined) return false;

      return isObject(actualValue.value)
        ? value.map(toRaw).some((o) => isEqual(o, actualValue.value))
        : value.map(toRaw).includes(actualValue.value);
    }
    if (value !== null && value !== undefined) return value === props.trueValue;
    return false;
  });

  const size = useProp<Size>('size');
  const checkboxSize = computed(() => size.value ?? checkboxGroup?.size?.value);

  const hasOwnLabel = computed(() => !isPropAbsent(props.label));

  return { isChecked, isFocused, checkboxSize, hasOwnLabel, actualValue };
};
