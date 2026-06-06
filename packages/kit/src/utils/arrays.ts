/**
 * Приводит значение к массиву.
 *
 * - Если значение falsy (кроме `0`) — возвращает пустой массив.
 * - Если значение уже массив — возвращает его как есть.
 * - Иначе — оборачивает значение в массив.
 *
 * @template T - Тип элементов массива.
 * @param arr - Одиночное значение или массив значений.
 * @returns Массив значений типа `T`.
 *
 * @example
 * ensureArray(1);           // [1]
 * ensureArray([1, 2, 3]);   // [1, 2, 3]
 * ensureArray(0);           // [0]
 * ensureArray(null);        // []
 * ensureArray(undefined);   // []
 * ensureArray('foo');       // ['foo']
 */
export const ensureArray = <T>(arr: T | T[]) => {
  if (!arr && arr !== 0) return [];
  return Array.isArray(arr) ? arr : [arr];
};
