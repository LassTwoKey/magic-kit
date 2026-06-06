<template>
  <div
    class="mk-color-picker"
    :class="{
      'mk-color-picker--disabled': disabled,
      'mk-color-picker--invalid': isInvalid,
    }"
  >
    <MkTooltip
      trigger="click"
      placement="bottom-start"
      :disabled="disabled"
      :show-arrow="false"
      :offset="4"
      :hide-after="0"
      @show="onPopupShow"
    >
      <MkInput
        class="mk-color-picker__input"
        :model-value="inputValue"
        :disabled="disabled"
        :invalid="isInvalid"
        :maxlength="7"
        placeholder="#000000"
        @update:model-value="onInput"
        @change="onChange"
      >
        <template #prepend>
          <div
            class="mk-color-picker__swatch"
            :style="{ backgroundColor: normalizedColor }"
          />
        </template>
      </MkInput>
      <template #content>
        <div class="mk-color-picker__popup">
          <MkColorPickerSvPanel
            :hue="hsv.h"
            :saturation="hsv.s"
            :value="hsv.v"
            :disabled="disabled"
            @update:sv="onSvUpdate"
          />
          <MkColorPickerHueSlider
            :hue="hsv.h"
            :disabled="disabled"
            @update:hue="onHueUpdate"
          />
        </div>
      </template>
    </MkTooltip>
    <div
      v-if="errorMessage"
      class="mk-color-picker__error"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { MkInput } from '@magic/kit/components/MkInput';
import { MkTooltip } from '@magic/kit/components/MkTooltip';

import type { Props, Emits } from './api';
import MkColorPickerHueSlider from './components/MkColorPickerHueSlider.vue';
import MkColorPickerSvPanel from './components/MkColorPickerSvPanel.vue';
import { hexToHsv, hsvToHex } from './utils';

defineOptions({
  name: 'MkColorPicker',
});

const HEX_REGEXP = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  disabled: false,
  error: undefined,
});

const emit = defineEmits<Emits>();

const inputValue = ref(props.modelValue);

const hsv = reactive({ h: 0, s: 0, v: 0 });

const syncHsvFromModel = (hex: string) => {
  if (HEX_REGEXP.test(hex)) {
    const parsed = hexToHsv(hex);
    hsv.h = parsed.h;
    hsv.s = parsed.s;
    hsv.v = parsed.v;
  }
};

syncHsvFromModel(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val;
    const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
    if (val && val.toUpperCase() !== currentHex) {
      syncHsvFromModel(val);
    }
  }
);

const isHexValid = (value: string): boolean => HEX_REGEXP.test(value);

const isInvalid = computed(() => {
  if (props.error) return true;
  if (!inputValue.value) return false;
  return !isHexValid(inputValue.value);
});

const errorMessage = computed(() => {
  if (props.error) return props.error;
  if (isInvalid.value) return 'Неверный формат цвета';
  return '';
});

const normalizedColor = computed(() => {
  if (isHexValid(inputValue.value)) return inputValue.value;
  return props.modelValue && isHexValid(props.modelValue) ? props.modelValue : '#000000';
});

const normalizeHex = (value: string): string => {
  let hex = value.trim();
  if (!hex.startsWith('#')) {
    hex = `#${hex}`;
  }
  return hex.toUpperCase();
};

const emitHexFromHsv = () => {
  const hex = hsvToHex(hsv.h, hsv.s, hsv.v);
  inputValue.value = hex;
  emit('update:modelValue', hex);
};

const onSvUpdate = (saturation: number, value: number) => {
  hsv.s = saturation;
  hsv.v = value;
  emitHexFromHsv();
};

const onHueUpdate = (hue: number) => {
  hsv.h = hue;
  emitHexFromHsv();
};

const onPopupShow = () => {
  syncHsvFromModel(props.modelValue);
};

const onInput = (val: string) => {
  inputValue.value = val;
  const normalized = normalizeHex(val);
  if (isHexValid(normalized)) {
    emit('update:modelValue', normalized);
    syncHsvFromModel(normalized);
  }
};

const onChange = (val: string) => {
  const normalized = normalizeHex(val);
  if (isHexValid(normalized)) {
    inputValue.value = normalized;
    emit('update:modelValue', normalized);
    emit('change', normalized);
    syncHsvFromModel(normalized);
  }
};
</script>

<style src="./MkColorPicker.scss"></style>
