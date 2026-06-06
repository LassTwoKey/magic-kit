/**
 * Определяет индекс ближайшей кнопки слайдера к указанному значению.
 *
 * В режиме `range` сравнивает расстояние от `value` до `firstValue`
 * и `secondValue`. В обычном режиме всегда возвращает `0`.
 *
 * @param value - Целевое значение.
 * @param firstValue - Текущее значение первой кнопки.
 * @param secondValue - Текущее значение второй кнопки.
 * @param range - `true`, если включён режим диапазона.
 * @returns `0` для первой кнопки, `1` — для второй.
 *
 * @example
 * getClosestButton(30, 20, 80, true) // 0
 * getClosestButton(70, 20, 80, true) // 1
 * getClosestButton(50, 0, 100, false) // 0
 */
export function getClosestButton(
  value: number,
  firstValue: number,
  secondValue: number,
  range: boolean
): number {
  if (!range) return 0;
  return Math.abs(value - firstValue) <= Math.abs(value - secondValue) ? 0 : 1;
}
