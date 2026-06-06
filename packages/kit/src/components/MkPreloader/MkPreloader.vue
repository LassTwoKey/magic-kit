<template>
  <span
    :class="classes"
    :style="style"
    aria-hidden="true"
  >
    <svg
      class="mk-preloader__svg"
      viewBox="0 0 18 18"
      fill="none"
    >
      <circle
        class="mk-preloader__track"
        cx="9"
        cy="9"
        r="7.5"
      />
      <circle
        class="mk-preloader__arc"
        cx="9"
        cy="9"
        r="7.5"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Props } from './api';

defineOptions({
  name: 'MkPreloader',
});

const props = withDefaults(defineProps<Props>(), { size: 18 });

const classes = computed(() => ['mk-preloader']);

const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));
</script>

<style src="./MkPreloader.scss"></style>
