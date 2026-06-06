import { nextTick } from 'vue';

import type { Props } from '../api';
import type { ModelValue } from '../types';
import type { CheckboxEmit } from './types';

import type { ComputedRef, Ref, WritableComputedRef } from 'vue';

interface UseCheckboxEventParams {
  model: WritableComputedRef<ModelValue | ModelValue[]>;
  isLimitExceeded: Ref<boolean>;
  hasOwnLabel: ComputedRef<boolean>;
  isDisabled: ComputedRef<boolean>;
}

export const useCheckboxEvent = (
  props: Props,
  emit: CheckboxEmit,
  { model, isLimitExceeded, hasOwnLabel, isDisabled }: UseCheckboxEventParams
) => {
  function getLabeledValue(isTruthy: boolean): ModelValue {
    return isTruthy ? (props.trueValue ?? true) : (props.falseValue ?? false);
  }

  function handleChange(e: Event): void {
    if (isLimitExceeded.value) return;
    const target = e.target as HTMLInputElement;
    emit('change', getLabeledValue(target.checked), e);
  }

  async function onClickRoot(e: MouseEvent): Promise<void> {
    if (isLimitExceeded.value || isDisabled.value || hasOwnLabel.value) return;

    const eventTargets = e.composedPath() as Element[];
    if (eventTargets.some((el) => el.tagName === 'LABEL')) return;

    const isCurrentlyFalse = model.value === false || model.value === (props.falseValue ?? false);
    model.value = getLabeledValue(isCurrentlyFalse);
    await nextTick();
    emit('change', model.value, e);
  }

  return { handleChange, onClickRoot };
};
