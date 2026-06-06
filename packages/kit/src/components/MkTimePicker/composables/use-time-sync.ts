import { nextTick, ref, watch } from 'vue';

import type { Props } from '../api';
import type { ColumnType, Time } from '../types';
import { formatTime } from '../utils/format-time';
import { parseTimeValue } from '../utils/parse-time-value';

/**
 * Composable для двусторонней синхронизации между инпутом и dropdown.
 *
 * - При изменении `modelValue` извне — обновляет строковое значение инпута.
 * - При вводе в инпут — парсит значение и обновляет temp-значения dropdown.
 * - При скролле/клике в dropdown — обновляет строковое значение инпута.
 *
 * Флаг `syncing` предотвращает зацикливание обновлений.
 */
export function useTimeSync(
  props: Props,
  tempValues: () => { hours: number; minutes: number; seconds: number },
  setTemp: (time: Time) => void,
  scrollTo: (type: ColumnType, value: number) => void
) {
  const syncing = ref(false);

  /** Строковое значение для MkInput. */
  const inputValue = ref('');

  /** Парсит modelValue (Date или строку) в объект времени. */
  function parseModelTime(): Time | null {
    if (props.modelValue == null) return null;

    if (props.modelValue instanceof Date) {
      return {
        hours: props.modelValue.getHours(),
        minutes: props.modelValue.getMinutes(),
        seconds: props.modelValue.getSeconds(),
      };
    }

    if (props.valueFormat) {
      return parseTimeValue(props.modelValue, props.valueFormat);
    }

    return null;
  }

  // Синхронизация: modelValue (снаружи) → inputValue
  watch(
    () => props.modelValue,
    () => {
      if (syncing.value) return;
      const time = parseModelTime();
      inputValue.value = time ? formatTime(time, props.format ?? 'HH:mm') : '';
    },
    { immediate: true }
  );

  // Синхронизация: ввод в инпут → temp-значения + scroll
  watch(inputValue, (val) => {
    if (syncing.value) return;
    const time = parseTimeValue(val, props.format ?? 'HH:mm');
    if (!time) return;
    syncing.value = true;
    setTemp(time);
    void nextTick(() => {
      scrollTo('hours', time.hours);
      scrollTo('minutes', time.minutes);
      if (props.enableSeconds) scrollTo('seconds', time.seconds ?? 0);
      syncing.value = false;
    });
  });

  /**
   * Синхронизирует строковое значение инпута из текущих temp-значений.
   *
   * Вызывается при скролле или клике в dropdown.
   */
  function syncInputFromTemp() {
    syncing.value = true;
    const vals = tempValues();
    inputValue.value = formatTime(vals, props.format ?? 'HH:mm');
    void nextTick(() => {
      syncing.value = false;
    });
  }

  return { inputValue, syncing, parseModelTime, syncInputFromTemp };
}
