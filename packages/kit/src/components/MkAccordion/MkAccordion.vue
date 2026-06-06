<template>
  <div
    class="mk-accordion"
    role="tablist"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { accordionKey } from '@magic/kit/constants';

import type { Emits, Props } from './api';
import type { AccordionContext } from './types';

defineOptions({
  name: 'MkAccordion',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  multiple: false,
});
const emit = defineEmits<Emits>();

const internalOpenItems = ref<Set<string | number>>(new Set());

const openItems = computed(() => {
  if (props.modelValue !== undefined) {
    return new Set(props.modelValue);
  }
  return internalOpenItems.value;
});

const multiple = computed(() => props.multiple);

function toggleItem(name: string | number) {
  const next = new Set(openItems.value);
  const isOpen = next.has(name);

  if (isOpen) {
    next.delete(name);
    emit('close', name);
  } else {
    if (!multiple.value) {
      next.clear();
    }
    next.add(name);
    emit('open', name);
  }

  if (props.modelValue !== undefined) {
    emit('update:modelValue', [...next]);
  } else {
    internalOpenItems.value = next;
  }
}

provide<AccordionContext>(accordionKey, {
  openItems,
  multiple,
  toggleItem,
});

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) {
      internalOpenItems.value = new Set(val);
    }
  },
  { immediate: true }
);
</script>

<style src="./MkAccordion.scss"></style>
