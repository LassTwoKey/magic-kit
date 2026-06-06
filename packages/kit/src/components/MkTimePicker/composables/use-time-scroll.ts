import { ref } from 'vue';

import { ITEM_HEIGHT, MAX_HOURS, MAX_MINUTES_SECONDS } from '../consts';
import type { ColumnType } from '../types';

/**
 * Composable для управления скроллом колонок time-picker.
 *
 * Предоставляет методы для программного скролла, обработки кликов по элементам
 * и обработки свободного скролла с автоматическим snap к ближайшему значению.
 */
export function useTimeScroll(
  columnRefs: () => Record<ColumnType, HTMLElement | undefined>,
  tempValues: () => { hours: number; minutes: number; seconds: number },
  onUpdate: (type: ColumnType, value: number) => void
) {
  const scrollRaf = ref<Record<string, number | undefined>>({});

  /**
   * Прокручивает колонку к указанному значению.
   *
   * @param type - Тип колонки (hours / minutes / seconds).
   * @param value - Целевое значение (0–23 для часов, 0–59 для остальных).
   * @param smooth - Если `true`, используется плавная анимация прокрутки.
   */
  function scrollTo(type: ColumnType, value: number, smooth = false) {
    const el = columnRefs()[type];
    if (!el) return;
    if (scrollRaf.value[type]) cancelAnimationFrame(scrollRaf.value[type]);
    el.scrollTo({ top: value * ITEM_HEIGHT, behavior: smooth ? 'smooth' : 'instant' });
  }

  /**
   * Обрабатывает клик по элементу колонки.
   *
   * Мгновенно обновляет значение и прокручивает к нему без анимации,
   * чтобы избежать конфликта с обработчиком свободного скролла.
   */
  function onItemClick(type: ColumnType, value: number) {
    onUpdate(type, value);
    scrollTo(type, value);
  }

  /**
   * Обрабатывает свободный скролл колонки.
   *
   * Считывает текущую позицию, обновляет temp-значение и планирует
   * программный snap к ближайшему валидному значению через `requestAnimationFrame`.
   */
  function onColumnScroll(type: ColumnType) {
    const el = columnRefs()[type];
    if (!el) return;

    const index = Math.round(el.scrollTop / ITEM_HEIGHT);
    const max = type === 'hours' ? MAX_HOURS : MAX_MINUTES_SECONDS;
    const value = Math.max(0, Math.min(max, index));

    onUpdate(type, value);

    if (scrollRaf.value[type]) cancelAnimationFrame(scrollRaf.value[type]);
    scrollRaf.value[type] = requestAnimationFrame(() => {
      const snapped = Math.round(el.scrollTop / ITEM_HEIGHT);
      const target = Math.max(0, Math.min(max, snapped));
      el.scrollTo({ top: target * ITEM_HEIGHT, behavior: 'smooth' });
    });
  }

  /**
   * Прокручивает все колонки к текущим temp-значениям.
   */
  function scrollToTempValues(enableSeconds: boolean) {
    const vals = tempValues();
    scrollTo('hours', vals.hours);
    scrollTo('minutes', vals.minutes);
    if (enableSeconds) scrollTo('seconds', vals.seconds);
  }

  return { scrollTo, onItemClick, onColumnScroll, scrollToTempValues };
}
