import type { Time } from '../types';

/**
 * Парсит строку времени по заданному шаблону в объект `{ hours, minutes, seconds }`.
 *
 * Извлекает значения по позициям токенов `HH`, `mm`, `ss` в строке формата.
 * Возвращает `null`, если часы или минуты не удалось распознать.
 *
 * @example
 * parseTimeValue('14:30', 'HH:mm') // { hours: 14, minutes: 30, seconds: 0 }
 * parseTimeValue('abc', 'HH:mm')   // null
 */
export function parseTimeValue(value: string, fmt: string): Time | null {
  try {
    const hhIdx = fmt.indexOf('HH');
    const mmIdx = fmt.indexOf('mm');
    const ssIdx = fmt.indexOf('ss');

    const hours = hhIdx !== -1 ? parseInt(value.substring(hhIdx, hhIdx + 2), 10) : 0;
    const minutes = mmIdx !== -1 ? parseInt(value.substring(mmIdx, mmIdx + 2), 10) : 0;
    const seconds = ssIdx !== -1 ? parseInt(value.substring(ssIdx, ssIdx + 2), 10) : 0;

    if (isNaN(hours) || isNaN(minutes)) return null;
    return { hours, minutes, seconds };
  } catch {
    return null;
  }
}
