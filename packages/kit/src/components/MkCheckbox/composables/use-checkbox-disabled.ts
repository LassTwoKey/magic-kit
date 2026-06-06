import { computed, inject } from 'vue';
import { checkboxGroupContextKey } from '@magic/kit/constants';
import { useProp } from '@magic/kit/hooks';
import { isArray, isUndefined } from '@magic/kit/utils';

import type { ModelValue } from '../types';
import type { CheckboxGroupContext } from './types';

import type { ComputedRef, WritableComputedRef } from 'vue';

interface UseCheckboxDisabledParams {
  model: WritableComputedRef<ModelValue | ModelValue[]>;
  isChecked: ComputedRef<boolean>;
}

type CheckboxGroupDisabledContext = Pick<CheckboxGroupContext, 'disabled' | 'min' | 'max'>;

export const useCheckboxDisabled = ({ model, isChecked }: UseCheckboxDisabledParams) => {
  const checkboxGroup = inject<CheckboxGroupDisabledContext | undefined>(
    checkboxGroupContextKey,
    undefined
  );

  const isLimitDisabled = computed(() => {
    if (!checkboxGroup) return false;
    const max = checkboxGroup.max?.value;
    const min = checkboxGroup.min?.value;
    const modelLength = isArray(model.value) ? model.value.length : 0;
    return (
      (!isUndefined(max) && modelLength >= max && !isChecked.value) ||
      (!isUndefined(min) && modelLength <= min && isChecked.value)
    );
  });

  const disabled = useProp<boolean>('disabled');
  const isDisabled = computed(
    () => !!disabled.value || !!checkboxGroup?.disabled?.value || isLimitDisabled.value
  );

  return { isDisabled, isLimitDisabled };
};
