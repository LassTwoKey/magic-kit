import { roundToPrecision } from './round-to-precision';

/**
 * Приводит значение к ближайшему допустимому шагу внутри диапазона `[min, max]`.
 *
 * Вычисляет ближайший шаг, ограничивает результат диапазоном
 * и округляет до заданной точности.
 *
 * @param val - Исходное значение.
 * @param min - Минимальная граница диапазона.
 * @param max - Максимальная граница диапазона.
 * @param step - Шаг изменения.
 * @param precision - Точность округления (знаки после запятой).
 * @returns Значение, приведённое к ближайшему шагу.
 *
 * @example
 * snapToStep(7, 0, 10, 2, 0) // 8
 * snapToStep(0.15, 0, 1, 0.1, 1) // 0.2
 * snapToStep(-5, 0, 100, 10, 0) // 0
 */
export function snapToStep(
  val: number,
  min: number,
  max: number,
  step: number,
  precision: number
): number {
  const steps = Math.round((val - min) / step);
  const snapped = min + steps * step;
  const clamped = Math.min(max, Math.max(min, snapped));
  return roundToPrecision(clamped, precision);
}
