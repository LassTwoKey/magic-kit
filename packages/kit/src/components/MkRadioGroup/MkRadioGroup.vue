<template>
  <div
    class="mk-radio-group"
    role="radiogroup"
  >
    <slot>
      <mk-radio
        v-for="(item, index) in normalizedOptions"
        :key="index"
        v-bind="item"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, reactive } from 'vue';
import { MkRadio } from '@magic/kit/components/MkRadio';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT, radioGroupKey } from '@magic/kit/constants';
import { useId } from '@magic/kit/hooks';

import type { Emits, Props } from './api';
import { defaultProps } from './api';

import type { ModelValue } from '@magic/kit/components/MkRadio/types';

defineOptions({
  name: 'MkRadioGroup',
});

const props = withDefaults(defineProps<Props>(), { disabled: false });
const emit = defineEmits<Emits>();

const radioId = useId();
const changeEvent = (value: ModelValue) => {
  emit(UPDATE_MODEL_EVENT, value);
  nextTick(() => emit(CHANGE_EVENT, value));
};

const name = computed(() => props.name || radioId.value);

const aliasProps = computed(() => ({
  ...defaultProps,
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
  radioGroupKey,
  reactive({
    get modelValue() {
      return props.modelValue;
    },
    get disabled() {
      return props.disabled;
    },
    get name() {
      return name.value;
    },
    changeEvent,
  })
);
</script>
