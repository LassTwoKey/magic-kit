<template>
  <div
    ref="wrapperRef"
    class="mk-time-picker"
    :class="{
      'mk-time-picker--disabled': disabled,
      'mk-time-picker--open': isOpen,
      'mk-time-picker--invalid': !!error,
    }"
  >
    <MkInput
      v-model="inputValue"
      :placeholder="placeholder"
      :prefix-icon="MkAccessTimeIcon"
      :disabled="disabled"
      :clearable="clearable"
      :invalid="!!error"
      @focus="onInputFocus"
      @change="onInputChange"
      @clear="onClear"
    />

    <div
      v-if="error"
      class="mk-time-picker__error"
    >
      {{ error }}
    </div>

    <Transition name="mk-time-picker-dropdown">
      <div
        v-if="isOpen"
        class="mk-time-picker__dropdown"
        @mousedown.prevent
      >
        <div class="mk-time-picker__columns">
          <div
            ref="hoursRef"
            class="mk-time-picker__column"
            @scroll="onColumnScroll('hours')"
          >
            <div
              v-for="item in hoursList"
              :key="item.key"
              class="mk-time-picker__item"
              :class="{
                'mk-time-picker__item--active': item.value === tempHours,
                'mk-time-picker__item--pad': item.value === null,
              }"
              @click="item.value !== null && onItemClick('hours', item.value)"
            >
              {{ item.label }}
            </div>
          </div>

          <div
            ref="minutesRef"
            class="mk-time-picker__column"
            @scroll="onColumnScroll('minutes')"
          >
            <div
              v-for="item in minutesList"
              :key="item.key"
              class="mk-time-picker__item"
              :class="{
                'mk-time-picker__item--active': item.value === tempMinutes,
                'mk-time-picker__item--pad': item.value === null,
              }"
              @click="item.value !== null && onItemClick('minutes', item.value)"
            >
              {{ item.label }}
            </div>
          </div>

          <template v-if="enableSeconds">
            <div
              ref="secondsRef"
              class="mk-time-picker__column"
              @scroll="onColumnScroll('seconds')"
            >
              <div
                v-for="item in secondsList"
                :key="item.key"
                class="mk-time-picker__item"
                :class="{
                  'mk-time-picker__item--active': item.value === tempSeconds,
                  'mk-time-picker__item--pad': item.value === null,
                }"
                @click="item.value !== null && onItemClick('seconds', item.value)"
              >
                {{ item.label }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { MkInput } from '@magic/kit/components/MkInput';
import { MkAccessTimeIcon } from '@magic/kit/icons';

import type { Props, Emits } from './api';
import { useTimeScroll } from './composables/use-time-scroll';
import { useTimeSync } from './composables/use-time-sync';
import type { ColumnType, Time } from './types';
import { formatTime, generateItems, parseTimeValue } from './utils';

defineOptions({
  name: 'MkTimePicker',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  format: 'HH:mm',
  valueFormat: undefined,
  placeholder: '',
  disabled: false,
  enableSeconds: false,
  clearable: false,
  error: '',
});

const emit = defineEmits<Emits>();

const wrapperRef = ref<HTMLElement>();
const hoursRef = ref<HTMLElement>();
const minutesRef = ref<HTMLElement>();
const secondsRef = ref<HTMLElement>();

const columnRefs = computed(() => ({
  hours: hoursRef.value,
  minutes: minutesRef.value,
  seconds: secondsRef.value,
}));

const isOpen = ref(false);
const hasScrolled = ref(false);
const tempHours = ref(0);
const tempMinutes = ref(0);
const tempSeconds = ref(0);

const getTempValues = () => ({
  hours: tempHours.value,
  minutes: tempMinutes.value,
  seconds: tempSeconds.value,
});

const setTempValues = (time: Time) => {
  tempHours.value = time.hours;
  tempMinutes.value = time.minutes;
  tempSeconds.value = time.seconds ?? 0;
};

const setTempByType = (type: ColumnType, value: number) => {
  if (type === 'hours') tempHours.value = value;
  else if (type === 'minutes') tempMinutes.value = value;
  else tempSeconds.value = value;
};

const hoursList = computed(() => generateItems(24));
const minutesList = computed(() => generateItems(60));
const secondsList = computed(() => generateItems(60));

const { scrollTo, onItemClick, onColumnScroll, scrollToTempValues } = useTimeScroll(
  () => columnRefs.value,
  getTempValues,
  (type, value) => {
    setTempByType(type, value);
    syncInputFromTemp();
    hasScrolled.value = true;
  }
);

const { inputValue, parseModelTime, syncInputFromTemp } = useTimeSync(
  props,
  getTempValues,
  setTempValues,
  scrollTo
);

function onInputFocus() {
  if (props.disabled) return;
  isOpen.value = true;
}

function syncTempFromModel() {
  const time = parseModelTime();
  if (time) {
    setTempValues(time);
  } else {
    const now = new Date();
    tempHours.value = now.getHours();
    tempMinutes.value = now.getMinutes();
    tempSeconds.value = now.getSeconds();
  }
}

watch(isOpen, (open) => {
  if (open) {
    hasScrolled.value = false;
    syncTempFromModel();
    syncInputFromTemp();
    nextTick(() => {
      requestAnimationFrame(() => scrollToTempValues(props.enableSeconds));
    });
  } else if (hasScrolled.value) {
    confirmSelection();
  }
});

function onClickOutside(event: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside);
});

function confirmSelection() {
  const date = new Date();
  date.setHours(tempHours.value, tempMinutes.value, tempSeconds.value, 0);

  const value = props.valueFormat ? formatTime(getTempValues(), props.valueFormat) : date;

  emit('update:modelValue', value);
  emit('change', value);
}

function onInputChange(value: string) {
  isOpen.value = false;

  if (!value) {
    emit('update:modelValue', null);
    emit('change', null);
    return;
  }

  const time = parseTimeValue(value, props.format);
  if (time) {
    const date = new Date();
    date.setHours(time.hours, time.minutes, time.seconds, 0);

    const emitted = props.valueFormat ? formatTime(time, props.valueFormat) : date;

    emit('update:modelValue', emitted);
    emit('change', emitted);
  } else {
    const prev = parseModelTime();
    inputValue.value = prev ? formatTime(prev, props.format) : '';
  }
}

function onClear() {
  emit('update:modelValue', null);
  emit('change', null);
}
</script>

<style src="./MkTimePicker.scss"></style>
