import type { Time } from '../types';

/**
 * Форматирует объект времени в строку по заданному шаблону.
 *
 * Поддерживаемые токены: `HH` — часы, `mm` — минуты, `ss` — секунды.
 *
 * @example
 * formatTime({ hours: 9, minutes: 5 }, 'HH:mm') // '09:05'
 */
export function formatTime(time: Time, fmt: string): string {
  return fmt
    .replace('HH', String(time.hours).padStart(2, '0'))
    .replace('mm', String(time.minutes).padStart(2, '0'))
    .replace('ss', String(time.seconds ?? 0).padStart(2, '0'));
}
