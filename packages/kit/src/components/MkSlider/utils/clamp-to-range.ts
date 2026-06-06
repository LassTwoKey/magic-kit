/**
 * Ограничивает значение в диапазоне `[min, max]`.
 *
 * @param val - Исходное значение.
 * @param min - Минимальная граница.
 * @param max - Максимальная граница.
 * @returns Значение, ограниченное диапазоном.
 *
 * @example
 * clampToRange(5, 0, 10) // 5
 * clampToRange(-3, 0, 10) // 0
 * clampToRange(15, 0, 10) // 10
 */
export function clampToRange(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}
