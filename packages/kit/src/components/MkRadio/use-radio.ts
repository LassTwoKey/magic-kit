import { computed, inject, ref } from 'vue';
import { UPDATE_MODEL_EVENT, radioGroupKey } from '@magic/kit/constants';

import type { Props, Emits } from './api';
import type { ModelValue, RadioGroupContext } from './types';

import type { SetupContext } from 'vue';

export const useRadio = (props: Props, emit: SetupContext<Emits>['emit']) => {
  const radioRef = ref<HTMLInputElement>();
  const radioGroup = inject<RadioGroupContext | undefined>(radioGroupKey, undefined);
  const isGroup = computed(() => !!radioGroup);

  const actualValue = computed(() => props.value);

  const modelValue = computed({
    get(): ModelValue {
      return (isGroup.value ? radioGroup?.modelValue : props.modelValue) as ModelValue;
    },
    set(val: ModelValue) {
      if (isGroup.value) {
        radioGroup!.changeEvent(val);
      } else {
        emit(UPDATE_MODEL_EVENT, val);
      }
    },
  });

  const isDisabled = computed(() => !!(props.disabled || radioGroup?.disabled));
  const focus = ref(false);
  const tabIndex = computed(() => {
    return isDisabled.value || (isGroup.value && modelValue.value !== actualValue.value) ? -1 : 0;
  });
  const name = computed(() => props.name || radioGroup?.name);

  return {
    name,
    radioRef,
    isGroup,
    focus,
    disabled: isDisabled,
    tabIndex,
    modelValue,
    actualValue,
  };
};
