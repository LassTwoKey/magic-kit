import { computed } from 'vue';
import { isNumber, isStringNumber } from '@magic/kit/utils';

import type { Mark, MarksProp } from '../types';
import { roundToPrecision } from '../utils';

/**
 * Параметры composable для вычисления стилей слайдера.
 */
interface UseSliderStyleOptions {
  /** Реактивная ссылка на минимальное значение. */
  min: { value: number };
  /** Реактивная ссылка на максимальное значение. */
  max: { value: number };
  /** Реактивная ссылка на признак режима диапазона. */
  range: { value: boolean };
  /** Реактивная ссылка на признак вертикального режима. */
  vertical: { value: boolean };
  /** Реактивная ссылка на высоту компонента. */
  height: { value: string | number | undefined };
  /** Реактивная ссылка на метки. */
  marks: { value: MarksProp | undefined };
  /** Computed-значение первой кнопки. */
  firstValue: { value: number };
  /** Computed-значение второй кнопки. */
  secondValue: { value: number };
  /** Реактивная ссылка на точность. */
  precision: { value: number };
}

/**
 * Composable для вычисления стилей и состояния отображения слайдера.
 *
 * Возвращает computed-стили для корня, полосы прогресса, кнопок и меток,
 * а также утилиты для форматирования значения и нормализации меток.
 *
 * @param options - Параметры composable.
 * @returns Реактивные стили и вспомогательные функции.
 */
export function useSliderStyle(options: UseSliderStyleOptions) {
  const { min, max, range, vertical, height, marks, firstValue, secondValue, precision } = options;

  /** Признак наличия хотя бы одной метки. */
  const hasMarks = computed(() => !!marks.value && Object.keys(marks.value).length > 0);

  /** Нормализованные метки: строковые значения оборачиваются в `{ label }`. */
  const normalizedMarks = computed(() => {
    if (!marks.value) return {};
    const result: Record<number, Mark> = {};
    for (const [key, val] of Object.entries(marks.value)) {
      const numKey = Number(key);
      result[numKey] = typeof val === 'string' ? { label: val } : val;
    }
    return result;
  });

  /** Инлайн-стиль корневого элемента (высота). */
  const rootStyle = computed(() => {
    if (height.value == null) return undefined;

    if (isNumber(height.value)) return { height: `${height.value}px` };
    if (isStringNumber(height.value)) return { height: `${height.value}px` };

    return { height: height.value };
  });

  /** Инлайн-стиль полосы прогресса (bar). */
  const barStyle = computed(() => {
    const totalRange = max.value - min.value;
    if (totalRange === 0) return {};

    const minVal = range.value ? Math.min(firstValue.value, secondValue.value) : min.value;
    const maxVal = range.value ? Math.max(firstValue.value, secondValue.value) : firstValue.value;

    const start = ((minVal - min.value) / totalRange) * 100;
    const size = ((maxVal - minVal) / totalRange) * 100;

    return vertical.value
      ? { bottom: `${start}%`, height: `${size}%` }
      : { left: `${start}%`, width: `${size}%` };
  });

  /** Возвращает инлайн-стиль обёртки кнопки по её значению. */
  const getButtonWrapperStyle = (value: number) => {
    const totalRange = max.value - min.value;
    if (totalRange === 0) return {};

    const pct = ((value - min.value) / totalRange) * 100;
    return vertical.value ? { bottom: `${pct}%` } : { left: `${pct}%` };
  };

  /** Возвращает инлайн-стиль метки по её ключу (значению). */
  const getMarkStyle = (key: number) => {
    const totalRange = max.value - min.value;
    if (totalRange === 0) return {};

    const pct = ((key - min.value) / totalRange) * 100;
    const base = vertical.value ? { bottom: `${pct}%` } : { left: `${pct}%` };
    const mark = normalizedMarks.value[key];
    return mark?.style ? { ...base, ...mark.style } : base;
  };

  /** Проверяет, находится ли метка в активном диапазоне. */
  const isMarkActive = (key: number) => {
    if (range.value) {
      return (
        key >= Math.min(firstValue.value, secondValue.value) &&
        key <= Math.max(firstValue.value, secondValue.value)
      );
    }
    return key <= firstValue.value;
  };

  /** Форматирует значение для отображения в тултипе. */
  const formatValue = (val: number): number => roundToPrecision(val, precision.value);

  return {
    hasMarks,
    normalizedMarks,
    rootStyle,
    barStyle,
    getButtonWrapperStyle,
    getMarkStyle,
    isMarkActive,
    formatValue,
  };
}
