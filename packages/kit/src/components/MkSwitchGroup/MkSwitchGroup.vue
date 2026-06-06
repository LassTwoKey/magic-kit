<template>
  <div
    class="mk-switch-group"
    role="group"
  >
    <slot>
      <MkSwitch
        v-for="(item, index) in normalizedOptions"
        :key="index"
        v-bind="item"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, reactive } from 'vue';
import { MkSwitch } from '@magic/kit/components/MkSwitch';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT, switchGroupContextKey } from '@magic/kit/constants';

import type { Props, Emits } from './api';

import type { ModelValue } from '@magic/kit/components/MkSwitch/types';

defineOptions({
  name: 'MkSwitchGroup',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const changeEvent = async (value: ModelValue[]) => {
  emit(UPDATE_MODEL_EVENT, value);
  await nextTick();
  emit(CHANGE_EVENT, value);
};

const modelValue = computed({
  get(): ModelValue[] {
    return props.modelValue ?? [];
  },
  set(val: ModelValue[]) {
    changeEvent(val);
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

provide(
  switchGroupContextKey,
  reactive({
    modelValue,
    get disabled() {
      return props.disabled;
    },
    get min() {
      return props.min;
    },
    get max() {
      return props.max;
    },
    changeEvent,
  })
);
</script>
