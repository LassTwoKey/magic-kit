<template>
  <div :class="rootClass">
    <VueDatePicker
      ref="datepicker"
      v-model="internalDate"
      :range="range"
      :multi-calendars="range ? true : false"
      :auto-apply="!range"
      no-today
      :disabled="disabled"
      :disabled-dates="disabledDatesFn"
      :week-start="weekStart"
      :time-config="{ enableTimePicker: false }"
      :markers="markers"
      :floating="{ arrow: false, offset: 0 }"
      @update:model-value="onModelUpdate"
      @closed="onClosed"
    >
      <!-- Триггер -->
      <template #dp-input="{ value }">
        <slot
          v-if="$slots.trigger"
          name="trigger"
          :disabled="disabled"
          :invalid="invalid"
          :value="value"
        />
        <MkInputDropdown
          v-else
          :model-value="displayValue || placeholder"
          :placeholder="placeholder"
          :disabled="disabled"
          :invalid="invalid"
          :prefix-icon="prefixIcon"
        >
          <template
            v-if="$slots.prefixIcon"
            #prefixIcon
          >
            <slot name="prefixIcon" />
          </template>
        </MkInputDropdown>
      </template>

      <!-- Выбор месяца и кнопки перехода -->
      <!-- @vue-ignore -->
      <template #month-year="{ instance, month, year, months, updateMonthYear }">
        <div
          v-if="!overlay.open"
          class="dp__month-year-actions"
        >
          <button
            v-if="instance === 0 || !range"
            class="dp__month-year-actions-prev"
            @click="prevMonth(month, year)"
          >
            <MkChevronLeftIcon />
          </button>

          <div class="dp__month-year-actions-wrapper">
            <button
              v-if="range"
              class="dp__month-year-actions-wrapper-date"
              @click="selectMonthPeriod(month, year)"
            >
              {{ getMonthName(month) }} {{ year }}
            </button>

            <template v-else>
              <button
                class="dp__month-year-actions-wrapper-year"
                @click="toggleOverlay('year', year)"
              >
                {{ year }}
              </button>
              <button
                class="dp__month-year-actions-wrapper-month"
                @click="toggleOverlay('month', month)"
              >
                {{ getMonthName(month) }}
              </button>
            </template>
          </div>

          <button
            v-if="instance === 1 || !range"
            class="dp__month-year-actions-next"
            @click="nextMonth(month, year)"
          >
            <MkChevronRightIcon />
          </button>
        </div>

        <!-- Оверлей выбора месяца/года -->
        <div
          v-if="!range && overlay.open"
          class="dp__month-year-overlay"
        >
          <div class="dp__month-year-actions">
            <button
              v-if="overlay.type === 'month'"
              class="dp__month-year-actions-prev"
              @click="overlay.overlayYear--"
            >
              <MkChevronLeftIcon />
            </button>

            <div class="dp__month-year-actions-wrapper">
              <button
                class="dp__month-year-actions-wrapper-date"
                @click="overlay.open = false"
              >
                {{
                  overlay.type === 'month'
                    ? overlay.overlayYear
                    : `${limitedYears[0].text} - ${limitedYears[limitedYears.length - 1].text}`
                }}
              </button>
            </div>

            <button
              v-if="overlay.type === 'month'"
              class="dp__month-year-actions-next"
              @click="overlay.overlayYear++"
            >
              <MkChevronRightIcon />
            </button>
          </div>
          <div class="dp__month-year-overlay-grid">
            <button
              v-for="item in overlay.type === 'month' ? months : limitedYears"
              :key="item.value"
              class="dp__month-year-overlay-item"
              :class="{ 'dp__month-year-overlay-item--active': isOverlayItemActive(item.value) }"
              @click="onOverlaySelect(item.value, updateMonthYear)"
            >
              {{ item.text }}
            </button>
          </div>
        </div>
      </template>

      <!-- TO DO Выбор пресета диапазона -->
      <!-- <template #right-sidebar>
        <div style="width: 160px">
          <div>Today</div>
          <div>Yesterday</div>
          <div>Last 7 days</div>
          <div>Current month</div>
          <div>Last month</div>
          <div>Last 30 days</div>
        </div>
      </template> -->

      <!-- Action Меню для Range -->
      <template
        v-if="range"
        #action-row="{ modelValue, disabled: disabledAction, closePicker, selectDate }"
      >
        <div class="dp__action_row_content">
          <!-- TO DO Часовой пояс -->
          <span></span>

          <div class="dp__action_row_content_buttons">
            <MkButton
              label="Отмена"
              @click="closePicker"
            />
            <MkButton
              variant="primary"
              label="Применить"
              :disabled="disabledAction || !Array.isArray(modelValue) || modelValue.length !== 2"
              @click="onSelectDate(selectDate)"
            />
          </div>
        </div>
      </template>
    </VueDatePicker>

    <div
      v-if="errorMessage"
      class="mk-date-picker__error"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import { MkButton, MkInputDropdown } from '@magic/kit/components';
import { MkChevronLeftIcon, MkChevronRightIcon } from '@magic/kit/icons';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import type { Props, Emits } from './api';
import { markers, MONTH_NAMES } from './consts';

import '@vuepic/vue-datepicker/dist/main.css';

defineOptions({
  name: 'MkDatePicker',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  format: 'dd/MM/yyyy',
  disabled: false,
  range: false,
  prefixIcon: undefined,
  suffixIcon: undefined,
  placeholder: '',
  invalid: false,
  errorMessage: undefined,
  pickerOptions: undefined,
});

const emit = defineEmits<Emits>();

const dpRef = useTemplateRef<InstanceType<typeof VueDatePicker>>('datepicker');

// Внутренняя дата для VueDatePicker
const internalDate = ref<Date | Date[]>();

// Синхронизация modelValue -> internalDate
watch(
  () => props.modelValue,
  (val) => {
    internalDate.value = val ? (Array.isArray(val) ? [...val] : val) : undefined;
  },
  { immediate: true }
);

// Отключённые даты
const disabledDatesFn = computed(() => props.pickerOptions?.disabledDate);

// Первый день недели
const weekStart = computed(() => props.pickerOptions?.firstDayOfWeek ?? 1);

// CSS-классы корневого элемента
const rootClass = computed(() => [
  'mk-date-picker',
  {
    'mk-date-picker--disabled': props.disabled,
    'mk-date-picker--invalid': props.invalid && !props.disabled,
    'mk-date-picker--range': props.range,
    'mk-date-picker--overlay': overlay.open,
  },
]);

// Обновление модели при выборе в пикере
const onModelUpdate = (value: Date | Date[] | null) => {
  if (props.range && Array.isArray(value)) {
    props.pickerOptions?.onPick?.(value);
  }
};

// Подтверждение выбора (кнопка "Применить")
const onSelectDate = (selectDateFn: () => void) => {
  selectDateFn();

  const val = internalDate.value ?? null;
  emit('update:modelValue', val as Date | Date[] | null);
  emit('change', val as Date | Date[] | null);
};

const getMonthName = (month: number) => MONTH_NAMES[month];

const displayValue = computed(() => {
  const val = internalDate.value;
  if (!val) return '';

  const fmtDate = (date: Date) => {
    const monthName = MONTH_NAMES[date.getMonth()];
    const displayFormat = props.format.replace(/M{1,4}/i, `'${monthName}'`);
    return format(date, displayFormat);
  };

  if (Array.isArray(val)) {
    const [start, end] = val;
    if (!start) return '';
    if (!end) return fmtDate(start);
    return `${fmtDate(start)} — ${fmtDate(end)}`;
  }

  return fmtDate(val);
});

// Оверлей выбора месяца/года (только не range)
const overlay = reactive({
  open: false,
  type: 'month' as 'month' | 'year',
  currentValue: 0,
  overlayYear: new Date().getFullYear(),
});

const limitedYears = computed(() => {
  const currentYear =
    overlay.type === 'year' ? overlay.overlayYear : overlay.overlayYear || new Date().getFullYear();
  const startYear = currentYear - 4;
  return Array.from({ length: 12 }, (_, i) => ({
    text: String(startYear + i),
    value: startYear + i,
  }));
});

const toggleOverlay = (type: 'month' | 'year', currentValue: number) => {
  overlay.type = type;
  overlay.currentValue = currentValue;
  overlay.overlayYear = new Date().getFullYear();
  overlay.open = !overlay.open;
};

const isOverlayItemActive = (value: number) => {
  return value === overlay.currentValue;
};

const onOverlaySelect = (value: number, updateMonthYear: Function) => {
  const currentDate = Array.isArray(internalDate.value)
    ? internalDate.value[0]
    : internalDate.value;
  const currentMonth = currentDate ? currentDate.getMonth() : new Date().getMonth();
  const currentYear = currentDate ? currentDate.getFullYear() : new Date().getFullYear();

  if (overlay.type === 'month') {
    updateMonthYear(value, currentYear);
  } else {
    updateMonthYear(currentMonth, value);
  }

  overlay.open = false;
};

// Выбор периода — весь месяц
const selectMonthPeriod = (month: number, year: number) => {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  internalDate.value = [start, end];
};

// Навигация по месяцам
const nextMonth = (month: number, year: number) => {
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  dpRef.value?.setMonthYear({ month: nextMonth, year: nextYear });
};

const onClosed = () => {
  setTimeout(() => {
    overlay.open = false;
  }, 200);
};

const prevMonth = (month: number, year: number) => {
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  dpRef.value?.setMonthYear({ month: prevMonth, year: prevYear });
};
</script>

<style src="./MkDatePicker.scss"></style>
