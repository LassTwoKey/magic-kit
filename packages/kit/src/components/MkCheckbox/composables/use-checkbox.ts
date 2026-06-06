import { watch } from 'vue';
import { isArray } from '@magic/kit/utils';

import type { Props } from '../api';
import type { CheckboxEmit } from './types';
import { useCheckboxDisabled } from './use-checkbox-disabled';
import { useCheckboxEvent } from './use-checkbox-event';
import { useCheckboxModel } from './use-checkbox-model';
import { useCheckboxStatus } from './use-checkbox-status';

export const useCheckbox = (props: Props, emit: CheckboxEmit) => {
  const { model, isLimitExceeded } = useCheckboxModel(props, emit);
  const { isFocused, isChecked, checkboxSize, hasOwnLabel, actualValue } = useCheckboxStatus(
    props,
    { model }
  );
  const { isDisabled } = useCheckboxDisabled({ model, isChecked });
  const { handleChange, onClickRoot } = useCheckboxEvent(props, emit, {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
  });

  // Sync `checked` prop → model reactively (replaces the old sync setStoreValue call)
  watch(
    () => props.checked,
    (checked) => {
      if (!checked || actualValue.value === undefined) return;
      if (isArray(model.value) && !model.value.includes(actualValue.value)) {
        model.value = [...model.value, actualValue.value];
      } else {
        model.value = props.trueValue ?? true;
      }
    },
    { immediate: true }
  );

  return {
    isChecked,
    isDisabled,
    isFocused,
    checkboxSize,
    hasOwnLabel,
    model,
    actualValue,
    handleChange,
    onClickRoot,
  };
};
