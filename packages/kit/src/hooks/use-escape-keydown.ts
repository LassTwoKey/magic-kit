import { onBeforeUnmount, onMounted } from 'vue';
import { EVENT_CODE } from '@magic/kit/constants';
import { getEventCode, isClient } from '@magic/kit/utils';

/** Обработчик нажатия клавиши Escape. */
type EscapeHandler = (event: KeyboardEvent) => void;

/**
 * Глобальный список зарегистрированных обработчиков Escape.
 * Используется для реализации singleton-listener'а на `document`.
 */
let registeredEscapeHandlers: EscapeHandler[] = [];

/**
 * Единственный слушатель `keydown`, навешиваемый на `document`.
 * Вызывает все зарегистрированные обработчики при нажатии Escape.
 */
const cachedHandler = (event: KeyboardEvent) => {
  if (getEventCode(event) === EVENT_CODE.esc) {
    registeredEscapeHandlers.forEach((handler) => handler(event));
  }
};

/**
 * Composable для подписки на нажатие клавиши Escape.
 *
 * Использует единственный глобальный `keydown`-listener на `document`,
 * который регистрируется при появлении первого подписчика
 * и удаляется при уходе последнего.
 *
 * @param handler - Функция, вызываемая при нажатии Escape.
 *                  Получает оригинальный `KeyboardEvent`.
 * @returns Объект с методом `unregister` для ручной отписки вне компонентного контекста.
 *
 * @example
 * ```ts
 * // Внутри компонента — отписка происходит автоматически:
 * useEscapeKeydown((e) => {
 *   closeModal();
 * });
 *
 * // Вне компонента — отписка вручную:
 * const { unregister } = useEscapeKeydown(handler);
 * unregister();
 * ```
 */
export const useEscapeKeydown = (handler: EscapeHandler) => {
  /**
   * Регистрирует обработчик и при необходимости навешивает глобальный listener.
   * Защищена от двойной регистрации одного и того же обработчика.
   */
  const register = () => {
    if (!isClient) return;
    if (registeredEscapeHandlers.includes(handler)) return;

    if (registeredEscapeHandlers.length === 0) {
      document.addEventListener('keydown', cachedHandler);
    }
    registeredEscapeHandlers.push(handler);
  };

  /**
   * Удаляет обработчик и снимает глобальный listener, если подписчиков не осталось.
   */
  const unregister = () => {
    registeredEscapeHandlers = registeredEscapeHandlers.filter((h) => h !== handler);

    if (isClient && registeredEscapeHandlers.length === 0) {
      document.removeEventListener('keydown', cachedHandler);
    }
  };

  onMounted(register);
  onBeforeUnmount(unregister);

  return { unregister };
};
