import { getCurrentInstance, onMounted, ref, shallowRef, unref, watch } from 'vue';
import { isElement, isFocusable } from '@magic/kit/utils';
import { useEventListener } from '@vueuse/core';

import type { MaybeRef, Ref, ShallowRef } from 'vue';

interface UseFocusControllerParams {
  /** Реактивный флаг отключения — когда `true`, события focus/blur/click игнорируются. */
  disabled?: MaybeRef<boolean>;
  /**
   * Вызывается перед тем, как компонент получит фокус.
   * Если возвращает truthy-значение, получение фокуса отменяется.
   */
  beforeFocus?: (event: FocusEvent) => boolean | void;
  /** Вызывается после успешного получения фокуса. */
  afterFocus?: () => void;
  /**
   * Вызывается перед тем, как компонент потеряет фокус.
   * Если возвращает truthy-значение, потеря фокуса отменяется.
   */
  beforeBlur?: (event: FocusEvent) => boolean | void;
  /** Вызывается после успешной потери фокуса. */
  afterBlur?: () => void;
}

interface UseFocusControllerReturn {
  /** `true`, пока компонент удерживает фокус. */
  isFocused: Ref<boolean>;
  /**
   * Ref на корневой DOM-элемент обёртки компонента.
   * Должен быть привязан через `ref="wrapperRef"` в шаблоне — именно на него
   * навешиваются capturing-слушатели focus/blur/click.
   */
  wrapperRef: ShallowRef<HTMLElement | undefined>;
  /** Обработчик события `focus` — можно использовать напрямую в шаблоне. */
  handleFocus: (event: FocusEvent) => void;
  /** Обработчик события `blur` — можно использовать напрямую в шаблоне. */
  handleBlur: (event: FocusEvent) => void;
}

/**
 * Управляет состоянием фокуса компонента-обёртки над нативным `<input>` или `<textarea>`.
 *
 * Принцип работы:
 * - Capturing-слушатели на `wrapperRef` перехватывают `focus`/`blur` дочерних элементов.
 * - При получении фокуса устанавливает `isFocused = true` и вызывает `emit('focus', event)`.
 * - При потере фокуса проверяет, не переместился ли фокус внутри той же обёртки
 *   (`relatedTarget` содержится в `wrapperRef`), и только тогда сбрасывает состояние.
 * - Клик по не фокусируемой части обёртки передаёт фокус на `target`.
 * - Управляет атрибутом `tabindex="-1"` на обёртке, чтобы она могла участвовать
 *   в capturing без попадания в естественный порядок Tab.
 *
 * @param target - Ref на нативный элемент ввода внутри обёртки.
 * @param params - Опциональные хуки жизненного цикла фокуса и флаг `disabled`.
 * @returns Реактивный флаг `isFocused`, `wrapperRef` и обработчики событий.
 *
 * @example
 * const { isFocused, wrapperRef } = useFocusController(inputRef, { disabled });
 * // В шаблоне: <div ref="wrapperRef" :class="{ focused: isFocused }">...</div>
 */
export function useFocusController(
  target: Ref<HTMLElement | undefined>,
  { disabled, beforeFocus, afterFocus, beforeBlur, afterBlur }: UseFocusControllerParams = {}
): UseFocusControllerReturn {
  const instance = getCurrentInstance();
  if (!instance) {
    console.warn(
      '[use-focus-controller] getCurrentInstance() returned null. useFocusController() must be called at the top of a setup function.'
    );
  }
  const { emit } = instance!;

  const wrapperRef = shallowRef<HTMLElement>();
  const isFocused = ref(false);

  const handleFocus = (event: FocusEvent): void => {
    const cancelFocus = beforeFocus?.(event) ?? false;
    if (unref(disabled) || isFocused.value || cancelFocus) return;

    isFocused.value = true;
    emit('focus', event);
    afterFocus?.();
  };

  const handleBlur = (event: FocusEvent): void => {
    const cancelBlur = beforeBlur?.(event) ?? false;
    if (
      unref(disabled) ||
      (event.relatedTarget instanceof Node && wrapperRef.value?.contains(event.relatedTarget)) ||
      cancelBlur
    )
      return;

    isFocused.value = false;
    emit('blur', event);
    afterBlur?.();
  };

  // Клик по не фокусируемой части обёртки (например, по padding или иконке)
  // вручную передаёт фокус на нативный input.
  const handleClick = (event: MouseEvent): void => {
    if (
      unref(disabled) ||
      isFocusable(event.target as HTMLElement) ||
      (wrapperRef.value?.contains(document.activeElement) &&
        wrapperRef.value !== document.activeElement)
    )
      return;

    target.value?.focus();
  };

  // tabindex="-1" позволяет обёртке участвовать в capturing без попадания в Tab-порядок.
  watch([wrapperRef, () => unref(disabled)], ([el, isDisabled]) => {
    if (!el) return;
    if (isDisabled) {
      el.removeAttribute('tabindex');
    } else {
      el.setAttribute('tabindex', '-1');
    }
  });

  useEventListener(wrapperRef, 'focus', handleFocus, true);
  useEventListener(wrapperRef, 'blur', handleBlur, true);
  useEventListener(wrapperRef, 'click', handleClick, true);

  // В тестовом окружении capturing на wrapperRef может не срабатывать,
  // поэтому слушатели дополнительно навешиваются напрямую на нативный элемент ввода.
  if (import.meta.env.NODE_ENV === 'test') {
    onMounted(() => {
      const targetEl = isElement(target.value)
        ? target.value
        : document.querySelector<HTMLElement>('input,textarea');

      if (targetEl) {
        useEventListener(targetEl, 'focus', handleFocus, true);
        useEventListener(targetEl, 'blur', handleBlur, true);
      }
    });
  }

  return {
    isFocused,
    wrapperRef,
    handleFocus,
    handleBlur,
  };
}
