/**
 * Округляет число до указанной точности (кол-во знаков после запятой).
 *
 * @param val - Исходное число.
 * @param precision - Количество знаков после запятой.
 * @returns Округлённое число.
 *
 * @example
 * roundToPrecision(1.234, 2) // 1.23
 * roundToPrecision(1.236, 2) // 1.24
 * roundToPrecision(5, 0) // 5
 */
export function roundToPrecision(val: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(val * factor) / factor;
}
