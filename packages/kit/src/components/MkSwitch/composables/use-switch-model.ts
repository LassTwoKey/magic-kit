import { computed, getCurrentInstance, inject, ref } from 'vue';
import { switchGroupContextKey } from '@magic/kit/constants';
import { isArray, isUndefined } from '@magic/kit/utils';

import type { Props } from '../api';
import type { ModelValue, SwitchGroupContext } from '../types';

export const useSwitchModel = (props: Props) => {
  const selfModel = ref<ModelValue | ModelValue[]>(false);
  const { emit } = getCurrentInstance()!;

  const switchGroup = inject<SwitchGroupContext | undefined>(switchGroupContextKey, undefined);
  const isGroup = computed(() => !isUndefined(switchGroup?.modelValue));
  const isLimitExceeded = ref(false);

  const model = computed({
    get() {
      return isGroup.value ? switchGroup!.modelValue : (props.modelValue ?? selfModel.value);
    },

    set(val) {
      if (isGroup.value && isArray(val)) {
        const max = switchGroup!.max;
        isLimitExceeded.value =
          max !== undefined &&
          val.length > max &&
          val.length > (model.value as ModelValue[]).length;
        if (!isLimitExceeded.value) {
          void switchGroup!.changeEvent(val);
        }
      } else {
        emit('update:modelValue', val);
        selfModel.value = val as ModelValue;
      }
    },
  });

  return {
    model,
    isGroup,
    isLimitExceeded,
  };
};
