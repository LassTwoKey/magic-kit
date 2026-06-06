import { getCurrentInstance, nextTick } from 'vue';

import type { Props } from '../api';
import type { ModelValue } from '../types';

import type { WritableComputedRef, Ref, ComputedRef } from 'vue';

interface UseSwitchEventParams {
  model: WritableComputedRef<ModelValue | ModelValue[] | undefined>;
  isLimitExceeded: Ref<boolean>;
  hasOwnLabel: ComputedRef<boolean>;
  isDisabled: ComputedRef<boolean>;
}

export const useSwitchEvent = (
  props: Props,
  { model, isLimitExceeded, hasOwnLabel, isDisabled }: UseSwitchEventParams
) => {
  const { emit } = getCurrentInstance()!;

  function getLabeledValue(value: unknown): ModelValue {
    return [true, props.trueValue].includes(value as ModelValue)
      ? (props.trueValue ?? true)
      : (props.falseValue ?? false);
  }

  function handleChange(e: Event) {
    if (isLimitExceeded.value) return;
    const target = e.target as HTMLInputElement;
    emit('change', getLabeledValue(target.checked));
  }

  async function onClickRoot(e: MouseEvent) {
    if (isLimitExceeded.value) return;

    if (
      !hasOwnLabel.value &&
      !isDisabled.value
      // &&  isLabeledByFormItem.value TO DO: Понять где используется
    ) {
      // fix: https://github.com/element-plus/element-plus/issues/9981
      const eventTargets = e.composedPath();
      const hasLabel = eventTargets.some((item) => (item as HTMLElement).tagName === 'LABEL');
      if (!hasLabel) {
        model.value = getLabeledValue(
          [false, props.falseValue].includes(model.value as ModelValue)
        );
        await nextTick();
        emit('change', getLabeledValue(model.value));
      }
    }
  }

  return {
    handleChange,
    onClickRoot,
  };
};
