<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <textarea
      ref="textarea"
      class="mk-textarea__inner"
      v-bind="attrs"
      :name="name"
      :minlength="minlength"
      :maxlength="maxlength"
      :tabindex="tabindex"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :form="form"
      :autofocus="autofocus"
      :rows="rows"
      :style="{ resize }"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keydown="handleKeydown"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, shallowRef, useAttrs as useRawAttrs, watch } from 'vue';
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from '@magic/kit/constants';
import { useAttrs, useComposition, useFocusController } from '@magic/kit/hooks';
import { isNil } from 'lodash-es';

import type { Props, Emits, Exposes } from './api';

import type { StyleValue } from 'vue';

defineOptions({
  name: 'MkTextarea',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  autocomplete: 'off',
  rows: 2,
  resize: 'none',
  modelModifiers: () => ({}),
});

const emit = defineEmits<Emits>();

const rawAttrs = useRawAttrs();
const attrs = useAttrs();

const inputDisabled = computed(() => props.disabled);

const textarea = shallowRef<HTMLTextAreaElement | undefined>(undefined);

const { isFocused, handleFocus, handleBlur } = useFocusController(textarea, {
  disabled: inputDisabled,
});

const rootClass = computed(() => [
  'mk-textarea',
  {
    [`mk-textarea--${props.size}`]: props.size,
    'mk-textarea--disabled': inputDisabled.value,
    'mk-textarea--invalid': props.invalid,
    'mk-textarea--focused': isFocused.value,
  },
  rawAttrs.class,
]);

const rootStyle = computed(() => [rawAttrs.style as StyleValue]);

const nativeInputValue = computed(() => (isNil(props.modelValue) ? '' : String(props.modelValue)));

const hasModelModifiers = computed(() => !!Object.keys(props.modelModifiers).length);

const resizeArea = () => {
  if (!textarea.value?.offsetParent) return;
  if (!props.autosize) return;

  textarea.value.style.height = 'auto';
  textarea.value.style.height = `${textarea.value.scrollHeight}px`;
};

watch(
  () => props.modelValue,
  () => {
    nextTick(() => resizeArea());
  }
);

const setNativeInputValue = () => {
  const input = textarea.value;
  if (!input || input.value === nativeInputValue.value) return;
  input.value = nativeInputValue.value;
};

const handleInput = async (event: Event) => {
  if (isComposing.value) return;

  const { lazy } = props.modelModifiers;
  const { value } = event.target as HTMLTextAreaElement;
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
  const { value } = event.target as HTMLTextAreaElement;

  if (props.modelModifiers.lazy) {
    emit(UPDATE_MODEL_EVENT, value);
  }
  emit(CHANGE_EVENT, value);

  await nextTick();
  setNativeInputValue();
};

const { isComposing, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } =
  useComposition({ emit, afterComposition: handleInput });

const focus = () => textarea.value?.focus();

const blur = () => textarea.value?.blur();

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
  textarea.value?.select();
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
  if (!textarea.value) return;

  const { trim } = props.modelModifiers;
  const elValue = textarea.value.value;

  if (elValue === newValue) return;

  if (document.activeElement === textarea.value) {
    if (trim && elValue.trim() === newValue) return;
  }

  setNativeInputValue();
});

onMounted(() => {
  setNativeInputValue();
  resizeArea();
});

defineExpose<Exposes>({
  textarea,
  isComposing,
  focus,
  blur,
  select,
  clear,
});
</script>

<style src="./MkTextarea.scss"></style>
