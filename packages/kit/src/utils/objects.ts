import { isObject } from './types';

/**
 * Рекурсивная функция для глубокого слияния
 * @param {Object} target - Целевой объект для слияния
 * @param {Object} source - Исходный объект для слияния
 * @returns {Object} Результат глубокого слияния
 * */
function _deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target = {} as T,
  source = {} as U
): T & U {
  const mergedObj = { ...target } as T & U;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        isObject(sourceValue) &&
        Object.prototype.hasOwnProperty.call(target, key) &&
        isObject(targetValue)
      ) {
        (mergedObj as Record<string, unknown>)[key] = _deepMerge(targetValue, sourceValue);
      } else {
        (mergedObj as Record<string, unknown>)[key] = sourceValue;
      }
    }
  }

  return mergedObj;
}

/**
 * Объединяет несколько объектов в один
 * @param {...Object} args - Объекты для объединения
 * @returns {Object} Объединенный объект
 */
export function deepMerge(...args: Record<string, unknown>[]) {
  return args.reduce((acc, obj, i) => {
    return i === 0 ? obj : _deepMerge(acc, obj);
  }, {});
}
