import { computed, inject } from 'vue';
import { switchGroupContextKey } from '@magic/kit/constants';
import { useProp } from '@magic/kit/hooks';
import { isUndefined } from '@magic/kit/utils';

import type { ModelValue, SwitchGroupContext } from '../types';

import type { ComputedRef, WritableComputedRef } from 'vue';

interface UseSwitchDisabledParams {
  model: WritableComputedRef<ModelValue | ModelValue[] | undefined>;
  isChecked: ComputedRef<boolean>;
}

export const useSwitchDisabled = ({ model, isChecked }: UseSwitchDisabledParams) => {
  const switchGroup = inject<SwitchGroupContext | undefined>(switchGroupContextKey, undefined);

  const isLimitDisabled = computed(() => {
    if (!switchGroup) return false;
    const { max, min } = switchGroup;
    const length = Array.isArray(model.value) ? model.value.length : 0;
    return (
      (!isUndefined(max) && length >= max && !isChecked.value) ||
      (!isUndefined(min) && length <= min && isChecked.value)
    );
  });

  const disabled = useProp('disabled');
  const isDisabled = computed<boolean>(
    () => !!(disabled.value || switchGroup?.disabled || isLimitDisabled.value)
  );

  return {
    isDisabled,
    isLimitDisabled,
  };
};
