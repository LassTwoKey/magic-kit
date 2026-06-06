<template>
  <slot />
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { POPPER_INJECTION_KEY } from '@magic/kit/constants';

import type { Props, Exposes } from './api';

defineOptions({
  name: 'MkPopper',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  role: 'tooltip',
});

const triggerRef = ref();
const popperInstanceRef = ref();
const contentRef = ref();
const referenceRef = ref();
const role = computed(() => props.role);

const popperProvides = {
  triggerRef,
  popperInstanceRef,
  contentRef,
  referenceRef,
  role,
};

defineExpose<Exposes>(popperProvides);

provide(POPPER_INJECTION_KEY, popperProvides);
</script>
