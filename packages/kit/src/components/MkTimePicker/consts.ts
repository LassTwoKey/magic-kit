/** Высота одного элемента колонки в пикселях. Должна совпадать с `height` в SCSS. */
export const ITEM_HEIGHT = 34;

/** Количество видимых элементов в колонке. */
export const VISIBLE_ITEMS = 7;

/** Количество пустых элементов-отступов сверху и снизу каждой колонки. */
export const PADDING_COUNT = Math.floor(VISIBLE_ITEMS / 2);

/** Максимальное значение часов (24-часовой формат). */
export const MAX_HOURS = 23;

/** Максимальное значение минут и секунд. */
export const MAX_MINUTES_SECONDS = 59;
