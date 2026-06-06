<template>
  <div
    class="mk-checkbox-group"
    role="group"
  >
    <slot>
      <MkCheckbox
        v-for="(item, index) in normalizedOptions"
        :key="String(item.value ?? index)"
        v-bind="item"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, toRefs } from 'vue';
import { MkCheckbox } from '@magic/kit/components/MkCheckbox';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT, checkboxGroupContextKey } from '@magic/kit/constants';

import type { Emits, Props, Slots } from './api';

import type { ModelValue } from '@magic/kit/components/MkCheckbox/types';

defineOptions({
  name: 'MkCheckboxGroup',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

defineSlots<Slots>();

const changeEvent = async (value: ModelValue[]) => {
  emit(UPDATE_MODEL_EVENT, value);
  await nextTick();
  emit(CHANGE_EVENT, value);
};

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (val) changeEvent(val);
  },
});

const aliasProps = computed(() => ({
  label: 'label',
  value: 'value',
  disabled: 'disabled',
  ...props.props,
}));

const normalizedOptions = computed(() =>
  (props.options ?? []).map((option) => {
    const { label: labelKey, value: valueKey, disabled: disabledKey } = aliasProps.value;
    const keysToOmit = new Set([labelKey, valueKey, disabledKey]);
    const base = {
      label: option[labelKey] as string,
      value: option[valueKey] as ModelValue,
      disabled: option[disabledKey] as boolean | undefined,
    };
    const rest = Object.fromEntries(Object.entries(option).filter(([k]) => !keysToOmit.has(k)));
    return { ...rest, ...base };
  })
);

const { size, min, max, disabled } = toRefs(props);

provide(checkboxGroupContextKey, {
  size,
  min,
  max,
  disabled,
  modelValue,
  changeEvent,
});
</script>
