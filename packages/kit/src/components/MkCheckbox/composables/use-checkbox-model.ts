import { computed, inject, ref } from 'vue';
import { checkboxGroupContextKey } from '@magic/kit/constants';
import { isArray, isUndefined } from '@magic/kit/utils';

import type { Props } from '../api';
import type { ModelValue } from '../types';
import type { CheckboxEmit, CheckboxGroupContext } from './types';

import type { WritableComputedRef } from 'vue';

type CheckboxGroupModelContext = Pick<
  CheckboxGroupContext,
  'modelValue' | 'min' | 'max' | 'changeEvent'
>;

export const useCheckboxModel = (props: Props, emit: CheckboxEmit) => {
  const selfModel = ref<ModelValue>(false);
  const checkboxGroup = inject<CheckboxGroupModelContext | undefined>(
    checkboxGroupContextKey,
    undefined
  );
  const isGroup = computed(() => !isUndefined(checkboxGroup));
  const isLimitExceeded = ref(false);

  const model: WritableComputedRef<ModelValue | ModelValue[]> = computed({
    get() {
      return isGroup.value
        ? (checkboxGroup?.modelValue?.value ?? [])
        : (props.modelValue ?? selfModel.value);
    },

    set(val: ModelValue | ModelValue[]) {
      if (isGroup.value && isArray(val)) {
        const currentLength = isArray(model.value) ? model.value.length : 0;
        isLimitExceeded.value =
          checkboxGroup?.max?.value !== undefined &&
          val.length > checkboxGroup.max.value &&
          val.length > currentLength;
        if (!isLimitExceeded.value) checkboxGroup?.changeEvent(val);
      } else {
        emit('update:modelValue', val as ModelValue);
        selfModel.value = val as ModelValue;
      }
    },
  });

  return { model, isGroup, isLimitExceeded };
};
