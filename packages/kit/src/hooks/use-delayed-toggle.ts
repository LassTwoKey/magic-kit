import { unref } from 'vue';
import { isNumber } from '@magic/kit/utils';

import { useTimeout } from './use-timeout';

import type { MaybeRef } from 'vue';

/**
 * Параметры composable'а для управления отложенным показом/скрытием.
 */
interface UseDelayedToggleParams {
  /** Задержка перед показом в мс. Принимает реактивное или статическое значение. */
  showAfter: MaybeRef<number>;
  /** Задержка перед скрытием в мс. Принимает реактивное или статическое значение. */
  hideAfter: MaybeRef<number>;
  /**
   * Время до автоматического закрытия после открытия в мс.
   * Если значение <= 0 или не является числом, авто-закрытие не срабатывает.
   */
  autoClose?: MaybeRef<number>;
  /** Callback для открытия элемента. */
  open: (event?: Event) => void;
  /** Callback для закрытия элемента. */
  close: (event?: Event) => void;
}

/**
 * Composable для управления отложенным показом и скрытием элемента.
 *
 * Поддерживает:
 * - задержку перед открытием (`showAfter`)
 * - задержку перед закрытием (`hideAfter`)
 * - автоматическое закрытие через заданное время после открытия (`autoClose`)
 *
 * @example
 * ```ts
 * const { onOpen, onClose } = useDelayedToggle({
 *   showAfter: computed(() => props.showAfter),
 *   hideAfter: computed(() => props.hideAfter),
 *   autoClose: computed(() => props.autoClose),
 *   open: () => (visible.value = true),
 *   close: () => (visible.value = false),
 * });
 * ```
 */
export const useDelayedToggle = ({
  showAfter,
  hideAfter,
  autoClose,
  open,
  close,
}: UseDelayedToggleParams) => {
  const { registerTimeout } = useTimeout();
  const { registerTimeout: registerTimeoutForAutoClose, cancelTimeout: cancelTimeoutForAutoClose } =
    useTimeout();

  /**
   * Открывает элемент с опциональной задержкой.
   * После открытия запускает таймер авто-закрытия, если `autoClose` задан и > 0.
   *
   * @param event - DOM-событие, инициировавшее открытие (например, mouseenter)
   * @param delay - Задержка перед открытием в мс. По умолчанию берётся из `showAfter`
   */
  const onOpen = (event?: Event, delay = unref(showAfter)) => {
    registerTimeout(() => {
      open(event);

      const _autoClose = unref(autoClose);
      if (isNumber(_autoClose) && _autoClose > 0) {
        registerTimeoutForAutoClose(() => {
          close(event);
        }, _autoClose);
      }
    }, delay);
  };

  /**
   * Закрывает элемент с опциональной задержкой.
   * Отменяет активный таймер авто-закрытия, если он был запущен.
   *
   * @param event - DOM-событие, инициировавшее закрытие (например, mouseleave)
   * @param delay - Задержка перед закрытием в мс. По умолчанию берётся из `hideAfter`
   */
  const onClose = (event?: Event, delay = unref(hideAfter)) => {
    cancelTimeoutForAutoClose();
    registerTimeout(() => {
      close(event);
    }, delay);
  };

  return {
    onOpen,
    onClose,
  };
};
