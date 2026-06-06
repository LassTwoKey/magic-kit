import { isClient } from '@magic/kit/utils';
import { tryOnScopeDispose } from '@vueuse/core';

/**
 * Composable для управления одним таймером с автоматической очисткой.
 *
 * При повторном вызове `registerTimeout` предыдущий таймер отменяется.
 * Таймер автоматически отменяется при уничтожении scope (например, при размонтировании компонента).
 *
 * Безопасен для SSR: обращения к `window` защищены проверкой `isClient`.
 *
 * @example
 * ```ts
 * const { registerTimeout, cancelTimeout } = useTimeout();
 *
 * // Запустить с задержкой:
 * registerTimeout(() => doSomething(), 300);
 *
 * // Отменить вручную при необходимости:
 * cancelTimeout();
 * ```
 */
export function useTimeout() {
  let timeoutHandle: number | undefined;

  /**
   * Регистрирует новый таймер, отменяя предыдущий если он был активен.
   *
   * @param fn - Функция, которая будет вызвана по истечении задержки.
   * @param delay - Задержка в миллисекундах. При `0` выполняется в следующем макротаске.
   */
  const registerTimeout = (fn: () => void, delay: number): void => {
    if (!isClient) return;

    cancelTimeout();
    timeoutHandle = window.setTimeout(fn, delay);
  };

  /**
   * Отменяет активный таймер, если он существует.
   * Безопасно вызывать даже если таймер уже отработал или не был запущен.
   */
  const cancelTimeout = (): void => {
    if (timeoutHandle === undefined) return;

    if (isClient) window.clearTimeout(timeoutHandle);
    timeoutHandle = undefined;
  };

  tryOnScopeDispose(cancelTimeout);

  return {
    registerTimeout,
    cancelTimeout,
  };
}
