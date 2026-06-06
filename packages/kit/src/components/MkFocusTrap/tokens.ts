import { inject, provide, ref } from 'vue';

import type { FocusTrapContext } from './types';

import type { InjectionKey } from 'vue';

export const FOCUS_AFTER_TRAPPED = 'focus-trap.focus-after-trapped';
export const FOCUS_AFTER_RELEASED = 'focus-trap.focus-after-released';
export const FOCUSOUT_PREVENTED = 'focus-trap.focusout-prevented';

export const FOCUS_AFTER_TRAPPED_OPTS: EventInit = {
  cancelable: true,
  bubbles: false,
};
export const FOCUSOUT_PREVENTED_OPTS: EventInit = {
  cancelable: true,
  bubbles: false,
};

export const ON_TRAP_FOCUS_EVT = 'focusAfterTrapped';
export const ON_RELEASE_FOCUS_EVT = 'focusAfterReleased';

export const FOCUS_TRAP_INJECTION_KEY: InjectionKey<FocusTrapContext> = Symbol('MkFocusTrap');

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(): FocusTrapContext {
  const focusTrapRef = ref<HTMLElement>();

  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    const focusableElements =
      focusTrapRef.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ??
      ([] as unknown as NodeListOf<HTMLElement>);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  const context: FocusTrapContext = {
    focusTrapRef,
    onKeydown,
  };

  provide(FOCUS_TRAP_INJECTION_KEY, context);

  return context;
}

export function injectFocusTrap(): FocusTrapContext | undefined {
  return inject(FOCUS_TRAP_INJECTION_KEY);
}
