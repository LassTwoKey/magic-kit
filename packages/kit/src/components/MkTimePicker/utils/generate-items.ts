import { PADDING_COUNT } from '../consts';
import type { ColumnItem } from '../types';

/**
 * Генерирует список элементов для колонки скролла.
 *
 * Включает `PADDING_COUNT` пустых элементов сверху и снизу,
 * чтобы первое и последнее реальное значение можно было отцентрировать.
 *
 * @param count - Количество реальных значений (24 для часов, 60 для минут/секунд).
 */
export function generateItems(count: number): ColumnItem[] {
  const items: ColumnItem[] = [];
  for (let i = 0; i < PADDING_COUNT; i++) {
    items.push({ key: `pad-t-${i}`, value: null, label: '' });
  }
  for (let i = 0; i < count; i++) {
    items.push({ key: `${i}`, value: i, label: String(i).padStart(2, '0') });
  }
  for (let i = 0; i < PADDING_COUNT; i++) {
    items.push({ key: `pad-b-${i}`, value: null, label: '' });
  }
  return items;
}
