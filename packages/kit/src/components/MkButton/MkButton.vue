<template>
  <component
    :is="as"
    :class="classes"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :title="title"
    :disabled="disabled"
    @click="emit('click', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <MkIcon
      v-if="icon || $slots.icon"
      :class="iconClasses"
      :icon="icon"
      aria-hidden="true"
    >
      <slot name="icon" />
    </MkIcon>

    <span
      v-if="label"
      class="mk-button__label"
    >
      {{ label }}
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MkIcon } from '@magic/kit/components/MkIcon';

import type { Emits, Props, Slots } from './api';

defineOptions({
  name: 'MkButton',
});

const props = withDefaults(defineProps<Props>(), { variant: 'secondary', as: 'button' });

const emit = defineEmits<Emits>();

const slots = defineSlots<Slots>();

const classes = computed(() => [
  'mk-button',
  {
    'mk-button--outline': props.outline,
    'mk-button--text': props.text,
    'mk-button--icon-only': (props.icon || slots.icon) && !props.label,
    [`mk-button--${props.variant}`]: props.variant,
    [`mk-button--size-${props.size}`]: props.size,
    'mk-button--thin': props.thin,
  },
]);
const iconClasses = computed(() => [
  'mk-button__icon',
  {
    [`mk-button__icon--size-${props.size}`]: props.size,
    [`mk-button__icon--side-${props.iconSide}`]: props.iconSide,
  },
]);
</script>

<style src="./MkButton.scss"></style>
