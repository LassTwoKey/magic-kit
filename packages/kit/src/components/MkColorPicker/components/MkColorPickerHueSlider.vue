<template>
  <div
    ref="trackRef"
    class="mk-color-picker-hue-slider"
    @mousedown="onTrackMouseDown"
    @touchstart.prevent="onTouchStart"
  >
    <div
      class="mk-color-picker-hue-slider__thumb"
      :style="thumbStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue';

import { useHueDrag } from '../composables/use-hue-drag';

const props = defineProps<{
  hue: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:hue': [hue: number];
}>();

const trackRef = ref<HTMLElement>();

const thumbStyle = computed(() => ({
  left: `${(props.hue / 360) * 100}%`,
}));

const { onTrackMouseDown, onTouchStart } = useHueDrag({
  trackRef,
  disabled: toRef(props, 'disabled'),
  onUpdate: (h) => emit('update:hue', h),
});
</script>

<style src="../MkColorPicker.scss"></style>
