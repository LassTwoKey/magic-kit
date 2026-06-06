<template>
  <div :class="rootClass">
    <div
      :class="innerClass"
      @click="handleClick"
    >
      <!-- Description блок -->
      <div
        v-if="props.description"
        class="mk-input-dropdown__description"
      >
        {{ props.description }}
      </div>

      <!-- Статус (цветная полоска слева) -->
      <div
        v-if="props.status"
        :class="statusClass"
      >
        <MkIcon class="mk-input-dropdown__status-icon">
          <MkPendingIcon v-if="props.status === 'progress'" />
          <MkCheckIcon v-else-if="props.status === 'good'" />
          <MkCloseIcon v-else-if="props.status === 'bad'" />
        </MkIcon>
      </div>

      <!-- Иконка слева от текста -->
      <MkIcon
        v-if="$slots.prefixIcon || props.prefixIcon"
        class="mk-input-dropdown__prefix"
        :icon="props.prefixIcon"
      >
        <slot name="prefixIcon" />
      </MkIcon>

      <!-- Кружок статуса перед текстом -->
      <div
        v-if="props.statusDot"
        :class="statusDotClass"
      />

      <!-- Текст / placeholder -->
      <span :class="textClass">
        {{ displayText }}
      </span>

      <!-- Контент справа перед разделителем -->
      <div
        v-if="$slots.suffixContent"
        class="mk-input-dropdown__suffix"
      >
        <slot name="suffixContent" />
      </div>

      <!-- Sub buttons / стрелка / preloader -->
      <div
        v-if="$slots.subButtons"
        class="mk-input-dropdown__suffix-buttons"
      >
        <slot name="subButtons" />
      </div>
      <template v-else>
        <div class="mk-input-dropdown__divider" />
        <MkPreloader
          v-if="props.loading"
          class="mk-input-dropdown__preloader"
          :size="18"
        />
        <MkIcon
          v-else
          class="mk-input-dropdown__arrow"
        >
          <MkArrowDropDownIcon />
        </MkIcon>
      </template>
    </div>

    <!-- Ошибка валидации -->
    <div
      v-if="props.error"
      class="mk-input-dropdown__error"
    >
      {{ props.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MkIcon } from '@magic/kit/components/MkIcon';
import { MkPreloader } from '@magic/kit/components/MkPreloader';
import { MkArrowDropDownIcon, MkCheckIcon, MkCloseIcon, MkPendingIcon } from '@magic/kit/icons';

import type { Emits, Props } from './api';

defineOptions({
  name: 'MkInputDropdown',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
});

const emit = defineEmits<Emits>();

const displayText = computed(() => props.modelValue || props.placeholder);

const hasValue = computed(() => !!props.modelValue);

const rootClass = computed(() => [
  'mk-input-dropdown',
  {
    'mk-input-dropdown--disabled': props.disabled,
    'mk-input-dropdown--invalid': props.invalid,
    [`mk-input-dropdown--${props.size}`]: props.size,
    [`mk-input-dropdown--status-${props.status}`]: props.status,
  },
]);

const innerClass = computed(() => [
  'mk-input-dropdown__inner',
  {
    'mk-input-dropdown__inner--disabled': props.disabled,
    'mk-input-dropdown__inner--invalid': props.invalid,
  },
]);

const statusDotClass = computed(() => [
  'mk-input-dropdown__status-dot',
  {
    [`mk-input-dropdown__status-dot--${props.statusDot}`]: props.statusDot,
  },
]);

const statusClass = computed(() => [
  'mk-input-dropdown__status',
  {
    [`mk-input-dropdown__status--${props.status}`]: props.status,
  },
]);

const textClass = computed(() => [
  'mk-input-dropdown__text',
  {
    'mk-input-dropdown__text--placeholder': !hasValue.value,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return;
  emit('click', event);
};
</script>

<style src="./MkInputDropdown.scss"></style>
