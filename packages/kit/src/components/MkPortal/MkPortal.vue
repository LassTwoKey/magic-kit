<template>
  <template v-if="disabled">
    <slot />
  </template>
  <teleport
    v-else
    :to="to"
  >
    <slot />
  </teleport>
</template>

<script setup lang="ts">
import type { Props } from './api';

defineProps<Props>();
</script>
