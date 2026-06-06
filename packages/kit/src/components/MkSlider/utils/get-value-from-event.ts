/**
 * Вычисляет значение слайдера из координат события мыши или тача
 * относительно дорожки (runway).
 *
 * Определяет позицию указателя, вычисляет долю (ratio) внутри дорожки
 * и приводит результат к ближайшему шагу через `snapFn`.
 *
 * @param event - Событие `MouseEvent` или `TouchEvent`.
 * @param runway - DOM-элемент дорожки слайдера.
 * @param vertical - `true` для вертикального режима.
 * @param min - Минимальное значение диапазона.
 * @param max - Максимальное значение диапазона.
 * @param snapFn - Функция приведения значения к шагу.
 * @returns Значение, соответствующее позиции указателя.
 */
export function getValueFromEvent(
  event: MouseEvent | TouchEvent,
  runway: HTMLElement,
  vertical: boolean,
  min: number,
  max: number,
  snapFn: (val: number) => number
): number {
  const rect = runway.getBoundingClientRect();

  const clientXY =
    'touches' in event
      ? vertical
        ? event.touches[0].clientY
        : event.touches[0].clientX
      : vertical
        ? event.clientY
        : event.clientX;

  const ratio = vertical
    ? Math.max(0, Math.min(1, (rect.bottom - clientXY) / rect.height))
    : Math.max(0, Math.min(1, (clientXY - rect.left) / rect.width));

  return snapFn(min + ratio * (max - min));
}
