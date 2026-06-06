import { isArray } from '@magic/kit/utils';

import type { Props } from '../api';
import type { ModelValue } from '../types';
import { useSwitchDisabled } from './use-switch-disabled';
import { useSwitchEvent } from './use-switch-event';
import { useSwitchModel } from './use-switch-model';
import { useSwitchStatus } from './use-switch-status';

import type { Slots } from 'vue';

export const useSwitch = (props: Props, slots: Slots) => {
  const { model, isLimitExceeded } = useSwitchModel(props);
  const { isFocused, isChecked, hasOwnLabel, actualValue } = useSwitchStatus(props, slots, {
    model,
  });
  const { isDisabled } = useSwitchDisabled({ model, isChecked });
  const { handleChange, onClickRoot } = useSwitchEvent(props, {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
  });

  const setStoreValue = () => {
    const addToStore = () => {
      if (
        isArray(model.value) &&
        actualValue.value !== undefined &&
        !model.value.includes(actualValue.value as ModelValue)
      ) {
        model.value.push(actualValue.value as ModelValue);
      } else {
        model.value = props.trueValue ?? true;
      }
    };

    if (props.checked) addToStore();
  };

  setStoreValue();

  return {
    isChecked,
    isDisabled,
    isFocused,
    hasOwnLabel,
    model,
    actualValue,
    handleChange,
    onClickRoot,
  };
};
