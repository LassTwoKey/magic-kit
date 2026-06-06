import { isArray, isObject, isString } from '@vue/shared';
import { isNil } from 'lodash-es';

export {
  isArray,
  isFunction,
  isObject,
  isString,
  isDate,
  isPromise,
  isSymbol,
  isPlainObject,
} from '@vue/shared';

/** Возвращает `true`, если значение строго равно `undefined`. */
export const isUndefined = (val: unknown): val is undefined => val === undefined;

/** Возвращает `true`, если значение является булевым (`boolean`). */
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';

/** Возвращает `true`, если значение строго является числом (`number`). Принимает NaN как число. */
export const isNumber = (val: unknown): val is number => typeof val === 'number';

/**
 * Конвертирует строку в число через `parseFloat`.
 * Если строка не является числом, возвращает исходную строку без изменений.
 *
 * @param val - Строка для конвертации.
 * @returns Число, если конвертация успешна, иначе исходная строка.
 *
 * @example
 * looseToNumber('3.14') // → 3.14
 * looseToNumber('abc')  // → 'abc'
 */
export const looseToNumber = (val: string): number | string => {
  const n = Number.parseFloat(val);
  return Number.isNaN(n) ? val : n;
};

/**
 * Возвращает `true`, если значение считается «пустым»:
 * - falsy-значение, кроме `0`
 * - пустой массив
 * - объект без собственных ключей
 */
export const isEmpty = (val: unknown): boolean =>
  (!val && val !== 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !Object.keys(val).length);

/**
 * Проверяет, является ли значение DOM-элементом (`Element`).
 */
export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false;
  return e instanceof Element;
};

/**
 * Возвращает `true`, если prop равен `null` или `undefined` (т.е. не передан).
 * Используется для различения явно переданного `false`/`0` от отсутствующего prop.
 */
export const isPropAbsent = (prop: unknown): prop is null | undefined => isNil(prop);

/**
 * Возвращает `true`, если значение является строкой, которую можно привести к числу.
 *
 * @example
 * isStringNumber('42')   // → true
 * isStringNumber('3.14') // → true
 * isStringNumber('abc')  // → false
 */
export const isStringNumber = (val: unknown): boolean => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};

/** Возвращает `true`, если значение является объектом `window`. */
export const isWindow = (val: unknown): val is Window => val === window;
