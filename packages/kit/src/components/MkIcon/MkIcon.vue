<template>
  <i
    class="mk-icon"
    :style="style"
  >
    <component
      :is="icon"
      v-if="icon"
    />
    <slot v-else />
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isNumber, isStringNumber, isUndefined } from '@magic/kit/utils';

import type { Props, Slots } from './api';

defineOptions({
  name: 'MkIcon',
});

const props = defineProps<Props>();

defineSlots<Slots>();

const style = computed(() => ({
  fontSize: !isUndefined(props.size)
    ? isNumber(props.size) || isStringNumber(props.size)
      ? `${props.size}px`
      : props.size
    : undefined,
  color: props.color,
}));
</script>

<style src="./MkIcon.scss"></style>
