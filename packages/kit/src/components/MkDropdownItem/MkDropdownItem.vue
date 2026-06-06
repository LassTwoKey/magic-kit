<template>
  <div
    :class="classes"
    role="option"
    :aria-selected="props.active"
    :aria-disabled="props.disabled"
    @click="handleClick"
  >
    <MkIcon
      v-if="$slots.prefixIcon || props.icon"
      class="mk-dropdown-item__icon"
      :icon="props.icon"
    >
      <slot name="prefixIcon" />
    </MkIcon>

    <span class="mk-dropdown-item__text">
      <slot>
        {{ props.label }}
      </slot>
    </span>

    <div
      v-if="$slots.suffix"
      class="mk-dropdown-item__suffix"
    >
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MkIcon } from '@magic/kit/components/MkIcon';

import type { Emits, Props } from './api';

defineOptions({
  name: 'MkDropdownItem',
});

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<Emits>();

const classes = computed(() => [
  'mk-dropdown-item',
  {
    'mk-dropdown-item--active': props.active,
    'mk-dropdown-item--disabled': props.disabled,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return;
  emit('click', event);
};
</script>

<style src="./MkDropdownItem.scss"></style>
