<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <label
      v-if="label"
      :for="inputIdRef"
      class="visually-hidden"
    >
      {{ label }}
    </label>
    <div
      v-if="$slots.prepend"
      :class="['mk-input__prepend', { 'mk-input__prepend--invalid': invalid }]"
    >
      <slot name="prepend" />
    </div>

    <div
      ref="wrapperRef"
      :class="wrapperClass"
    >
      <MkIcon
        v-if="$slots.prefixIcon || prefixIcon"
        class="mk-input__icon"
        :icon="prefixIcon"
      >
        <slot name="prefixIcon" />
      </MkIcon>

      <input
        ref="input"
        class="mk-input__inner"
        v-bind="attrs"
        :name="name"
        :minlength="minlength"
        :maxlength="maxlength"
        :type="type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :tabindex="tabindex"
        :placeholder="placeholder"
        :form="form"
        :autofocus="autofocus"
        :aria-label="ariaLabel || label"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
        :aria-invalid="invalid"
        :aria-required="required"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @change="handleChange"
        @keydown="handleKeydown"
      />

      <MkIcon
        v-if="showClear"
        :class="['mk-input__icon', 'mk-input__clear']"
        :icon="clearIcon"
        @mousedown.prevent="NOOP"
        @click="clear"
      >
        <slot name="clearIcon">
          <MkDeleteIcon />
        </slot>
      </MkIcon>

      <MkIcon
        v-if="$slots.suffixIcon || suffixIcon"
        class="mk-input__icon"
        :icon="suffixIcon"
      >
        <slot name="suffixIcon" />
      </MkIcon>
    </div>
    <div
      v-if="$slots.append"
      :class="['mk-input__append', { 'mk-input__append--invalid': invalid }]"
    >
      <slot name="append" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  useAttrs as useRawAttrs,
  useSlots,
  watch,
} from 'vue';
import { MkIcon } from '@magic/kit/components/MkIcon';
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from '@magic/kit/constants';
import { useAttrs, useComposition, useFocusController, useId } from '@magic/kit/hooks';
import { MkDeleteIcon } from '@magic/kit/icons';
import { NOOP, looseToNumber } from '@magic/kit/utils';

import type { Props, Emits, Exposes } from './api';

import type { StyleValue } from 'vue';

const inputId = useId();
const inputIdRef = ref(inputId);

defineOptions({
  name: 'MkInput',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  autocomplete: 'off',
  modelModifiers: () => ({}),
});

const emit = defineEmits<Emits>();

const rawAttrs = useRawAttrs();
const attrs = useAttrs();
const slots = useSlots();

const rootClass = computed(() => [
  'mk-input',
  {
    [`mk-input--${props.size}`]: props.size,
    'mk-input--disabled': inputDisabled.value,
    'mk-input--with-prepend': slots.prepend,
    'mk-input--with-append': slots.append,
    'mk-input--hidden': props.type === 'hidden',
    'mk-input--invalid': props.invalid,
  },
  rawAttrs.class,
]);

const wrapperClass = computed(() => [
  'mk-input__wrapper',
  {
    [`mk-input__wrapper--${props.size}`]: props.size,
    'mk-input__wrapper--invalid': props.invalid,
    'mk-input__wrapper--disabled': props.disabled,
    'mk-input__wrapper--focused': isFocused.value,
    'mk-input__wrapper--with-prepend': slots.prepend,
    'mk-input__wrapper--with-append': slots.append,
  },
]);

const inputDisabled = computed(() => props.disabled);

const input = shallowRef();

const _ref = computed(() => input.value);

// wrapperRef for type="text"
const { isFocused, wrapperRef } = useFocusController(_ref, {
  disabled: inputDisabled,
});

const rootStyle = computed(() => [rawAttrs.style as StyleValue]);
const nativeInputValue = computed(() => (props.modelValue == null ? '' : String(props.modelValue)));
const showClear = computed(
  () => props.clearable && !inputDisabled.value && !props.readonly && !!nativeInputValue.value
);

const hasModelModifiers = computed(() => !!Object.keys(props.modelModifiers).length);

const setNativeInputValue = () => {
  const input = _ref.value;
  if (!input || input.value === nativeInputValue.value || props.type === 'file') return;
  input.value = nativeInputValue.value;
};

const handleInput = async (event: Event) => {
  if (isComposing.value) return;

  const { lazy } = props.modelModifiers;
  let { value } = event.target as HTMLInputElement;
  if (lazy) {
    emit(INPUT_EVENT, value);
    return;
  }

  emit(UPDATE_MODEL_EVENT, value);
  emit(INPUT_EVENT, value);

  // ensure native input value is controlled
  await nextTick();

  if (hasModelModifiers.value) {
    setNativeInputValue();
  }
};

const handleChange = async (event: Event) => {
  let { value } = event.target as HTMLInputElement;

  if (props.modelModifiers.lazy) {
    emit(UPDATE_MODEL_EVENT, value);
  }
  emit(CHANGE_EVENT, value, event);

  await nextTick();
  setNativeInputValue();
};

const { isComposing, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } =
  useComposition({ emit, afterComposition: handleInput });

const focus = () => _ref.value?.focus();

const blur = () => _ref.value?.blur();

const handleMouseLeave = (evt: MouseEvent) => {
  emit('mouseleave', evt);
};

const handleMouseEnter = (evt: MouseEvent) => {
  emit('mouseenter', evt);
};

const handleKeydown = (evt: KeyboardEvent) => {
  emit('keydown', evt);
};

const select = () => {
  _ref.value?.select();
};

const clear = () => {
  emit(UPDATE_MODEL_EVENT, '');
  emit(CHANGE_EVENT, '');
  emit('clear');
  emit(INPUT_EVENT, '');
};

// native input value is set explicitly
// do not use v-model / :value in template
watch(nativeInputValue, (newValue) => {
  if (!_ref.value) {
    return;
  }
  const { trim, number } = props.modelModifiers;
  const elValue = _ref.value.value;
  const displayValue =
    (number || props.type === 'number') && !/^0\d/.test(elValue)
      ? `${looseToNumber(elValue)}`
      : elValue;

  if (displayValue === newValue) {
    return;
  }

  if (document.activeElement === _ref.value && _ref.value.type !== 'range') {
    if (trim && displayValue.trim() === newValue) {
      return;
    }
  }

  setNativeInputValue();
});

// when change type,
// update DOM dependent value and styles
watch(
  () => props.type,
  async () => {
    await nextTick();
    setNativeInputValue();
  }
);

onMounted(() => {
  setNativeInputValue();
});

defineExpose<Exposes>({
  input,
  isComposing,
  focus,
  blur,
  select,
  clear,
});
</script>

<style src="./MkInput.scss"></style>
