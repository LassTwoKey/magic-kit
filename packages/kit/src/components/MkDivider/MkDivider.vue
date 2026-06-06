<template>
  <div
    :class="['mk-divider', { [`mk-divider--${direction}`]: direction }]"
    role="separator"
  ></div>
</template>

<script setup lang="ts">
import type { Props } from './api';

defineOptions({
  name: 'MkDivider',
});

withDefaults(defineProps<Props>(), { direction: 'horizontal' });
</script>

<style src="./MkDivider.scss"></style>
