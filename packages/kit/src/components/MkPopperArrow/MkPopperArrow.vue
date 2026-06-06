<template>
  <span
    ref="arrowRef"
    class="mk-popper-arrow"
    :style="arrowStyle"
    data-popper-arrow
  />
</template>

<script setup lang="ts">
import { inject, ref, onBeforeUnmount } from 'vue';
import { POPPER_CONTENT_INJECTION_KEY } from '@magic/kit/constants';

defineOptions({
  name: 'MkPopperArrow',
  inheritAttrs: false,
});
const { arrowRef, arrowStyle } = inject(POPPER_CONTENT_INJECTION_KEY, {
  arrowRef: ref<HTMLElement | undefined>(),
  arrowStyle: ref({}),
});

onBeforeUnmount(() => {
  if (arrowRef) {
    arrowRef.value = undefined;
  }
});

defineExpose({
  arrowRef,
});
</script>

<style src="./MkPopperArrow.scss"></style>
