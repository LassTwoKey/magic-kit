<template>
  <div
    class="mk-slider"
    :class="{
      'mk-slider--vertical': vertical,
      'mk-slider--disabled': disabled,
      'mk-slider--dragging': isDragging,
      'mk-slider--has-marks': hasMarks,
    }"
    :style="rootStyle"
  >
    <div
      ref="runwayRef"
      class="mk-slider__runway"
      @mousedown="onRunwayClick"
    >
      <div
        class="mk-slider__bar"
        :style="barStyle"
      />

      <div
        v-if="hasMarks"
        class="mk-slider__marks"
      >
        <div
          v-for="(mark, key) in normalizedMarks"
          :key="key"
          class="mk-slider__mark"
          :class="{ 'mk-slider__mark--active': isMarkActive(Number(key)) }"
          :style="getMarkStyle(Number(key))"
        >
          <span class="mk-slider__mark-dot" />
          <span
            v-if="mark.label"
            class="mk-slider__mark-label"
            >{{ mark.label }}</span
          >
        </div>
      </div>

      <!-- Первая кнопка -->
      <div
        class="mk-slider__button-wrapper"
        :style="getButtonWrapperStyle(firstValue)"
        role="slider"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="firstValue"
        :aria-disabled="disabled"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        :tabindex="disabled ? undefined : 0"
        @mousedown.prevent.stop="onButtonDown($event, 0)"
        @touchstart.prevent.stop="onTouchStart($event, 0)"
        @keydown="onKeydown($event, 0)"
      >
        <MkTooltip
          v-if="showTooltip"
          :visible="draggingIndex === 0 ? true : null"
          :placement="vertical ? 'right' : 'top'"
          :show-arrow="tooltip === 'arrow'"
          :offset="TOOLTIP_OFFSET"
          trigger="hover"
        >
          <div class="mk-slider__button" />
          <template #content>{{ formatValue(firstValue) }}</template>
        </MkTooltip>
        <div
          v-else
          class="mk-slider__button"
        />
      </div>

      <!-- Вторая кнопка (режим range) -->
      <div
        v-if="range"
        class="mk-slider__button-wrapper"
        :style="getButtonWrapperStyle(secondValue)"
        role="slider"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="secondValue"
        :aria-disabled="disabled"
        :aria-orientation="vertical ? 'vertical' : 'horizontal'"
        :tabindex="disabled ? undefined : 0"
        @mousedown.prevent.stop="onButtonDown($event, 1)"
        @touchstart.prevent.stop="onTouchStart($event, 1)"
        @keydown="onKeydown($event, 1)"
      >
        <MkTooltip
          v-if="showTooltip"
          :visible="draggingIndex === 1 ? true : null"
          :placement="vertical ? 'right' : 'top'"
          :show-arrow="tooltip === 'arrow'"
          :offset="TOOLTIP_OFFSET"
          trigger="hover"
        >
          <div class="mk-slider__button" />
          <template #content>{{ formatValue(secondValue) }}</template>
        </MkTooltip>
        <div
          v-else
          class="mk-slider__button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';
import { MkTooltip } from '@magic/kit/components/MkTooltip';

import type { Props, Emits } from './api';
import { useSliderDrag } from './composables/use-slider-drag';
import { useSliderStyle } from './composables/use-slider-style';
import { TOOLTIP_OFFSET } from './consts';
import { clampToRange, roundToPrecision, snapToStep } from './utils';

defineOptions({
  name: 'MkSlider',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  showTooltip: true,
  tooltip: 'arrow',
  range: false,
  marks: undefined,
  vertical: false,
  height: undefined,
  disabled: false,
});

const emit = defineEmits<Emits>();

const runwayRef = ref<HTMLElement>();

const { min, max, step, range, disabled, vertical, height, marks } = toRefs(props);

const precision = computed(() => {
  const stepStr = String(step.value);
  const dot = stepStr.indexOf('.');
  return dot === -1 ? 0 : stepStr.length - dot - 1;
});

const firstValue = computed(() => {
  if (range.value) {
    const val = Array.isArray(props.modelValue) ? props.modelValue[0] : min.value;
    return roundToPrecision(Number(val), precision.value);
  }
  return roundToPrecision(Number(props.modelValue), precision.value);
});

const secondValue = computed(() => {
  if (range.value) {
    const val = Array.isArray(props.modelValue) ? props.modelValue[1] : max.value;
    return roundToPrecision(Number(val), precision.value);
  }
  return max.value;
});

// Клэмпинг при изменении min/max
watch(
  () => [props.min, props.max],
  () => {
    if (range.value) {
      const first = snapToStep(
        clampToRange(firstValue.value, min.value, max.value),
        min.value,
        max.value,
        step.value,
        precision.value
      );
      const second = snapToStep(
        clampToRange(secondValue.value, min.value, max.value),
        min.value,
        max.value,
        step.value,
        precision.value
      );
      emit('update:modelValue', [first, second]);
    } else {
      const clamped = snapToStep(
        clampToRange(firstValue.value, min.value, max.value),
        min.value,
        max.value,
        step.value,
        precision.value
      );
      emit('update:modelValue', clamped);
    }
  }
);

const { draggingIndex, isDragging, onRunwayClick, onButtonDown, onTouchStart, onKeydown } =
  useSliderDrag({
    min,
    max,
    step,
    range,
    disabled,
    vertical,
    precision,
    runwayRef,
    firstValue,
    secondValue,
    emit,
  });

const {
  hasMarks,
  normalizedMarks,
  rootStyle,
  barStyle,
  getButtonWrapperStyle,
  getMarkStyle,
  isMarkActive,
  formatValue,
} = useSliderStyle({
  min,
  max,
  range,
  vertical,
  height,
  marks,
  firstValue,
  secondValue,
  precision,
});
</script>

<style src="./MkSlider.scss"></style>
