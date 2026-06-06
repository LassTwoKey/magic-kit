<template>
  <mk-input
    ref="inputRef"
    v-model="formattedValue"
    class="mk-input-number"
  >
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName as SlotName"
        v-bind="slotProps ?? {}"
      />
    </template>
  </mk-input>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useCurrencyInput } from 'vue-currency-input';
import { MkInput } from '@magic/kit/components/MkInput';

import type { Props, Slots, SlotName, Exposes } from './api';

import type { CurrencyInputOptions, CurrencyDisplay } from 'vue-currency-input';

defineOptions({
  name: 'MkInputNumber',
});

const props = withDefaults(defineProps<Props>(), { precision: 2, useGrouping: true });

defineSlots<Slots>();

const options = computed<CurrencyInputOptions>(() => ({
  currency: 'USD', // required ¯\_(ツ)_/¯
  locale: 'mfe',
  currencyDisplay: 'hidden' as CurrencyDisplay,
  autoDecimalDigits: false,
  precision: { min: 0, max: props.precision },
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: true,
  valueScaling: undefined,
  valueRange: { min: props.min, max: props.max },
  useGrouping: props.useGrouping,
}));

const { inputRef, formattedValue, setValue, setOptions } = useCurrencyInput(options.value, true);

onMounted(() => {
  setValue(props.modelValue ?? null);
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(value ?? null);
  }
);

watch(options, (value) => {
  setOptions(value);
});

defineExpose({
  input: computed(() => inputRef.value?.input ?? null),
  isComposing: computed(() => inputRef.value?.isComposing?.value ?? false),
  focus: () => inputRef.value?.focus?.(),
  blur: () => inputRef.value?.blur?.(),
  select: () => inputRef.value?.select?.(),
  clear: () => inputRef.value?.clear?.(),
} satisfies Exposes);
</script>
