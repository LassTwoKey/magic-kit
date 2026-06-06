<template>
  <div
    ref="panelRef"
    class="mk-color-picker-sv-panel"
    :style="{ backgroundColor: pureHueColor }"
    @mousedown="onPanelMouseDown"
    @touchstart.prevent="onTouchStart"
  >
    <div
      class="mk-color-picker-sv-panel__thumb"
      :style="thumbStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue';

import { useSvDrag } from '../composables/use-sv-drag';
import { hsvToHex } from '../utils';

const props = defineProps<{
  hue: number;
  saturation: number;
  value: number;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:sv': [saturation: number, value: number];
}>();

const panelRef = ref<HTMLElement>();

const pureHueColor = computed(() => hsvToHex(props.hue, 100, 100));

const thumbStyle = computed(() => ({
  left: `${props.saturation}%`,
  top: `${100 - props.value}%`,
}));

const { onPanelMouseDown, onTouchStart } = useSvDrag({
  panelRef,
  disabled: toRef(props, 'disabled'),
  onUpdate: (s, v) => emit('update:sv', s, v),
});
</script>

<style src="../MkColorPicker.scss"></style>
