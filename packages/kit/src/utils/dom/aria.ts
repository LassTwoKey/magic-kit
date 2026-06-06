/**
 * Проверяет, является ли переданное значение HTMLElement.
 */
const isHTMLElement = (e: unknown): e is HTMLElement => {
  if (typeof HTMLElement === 'undefined') return false;
  return e instanceof HTMLElement;
};

/**
 * Определяет, может ли элемент получить фокус с клавиатуры.
 *
 * Порядок проверок:
 * - `tabIndex > 0` или явно установленный `tabindex="0"` → фокусируемый.
 * - `tabIndex < 0`, атрибут `disabled` или `aria-disabled="true"` → не фокусируемый.
 * - Для `<a>`, `<input>`, `<button>`, `<select>`, `<textarea>` — решение по `nodeName`.
 */
export const isFocusable = (element: HTMLElement): boolean => {
  if (
    element.tabIndex > 0 ||
    (element.tabIndex === 0 && element.getAttribute('tabindex') !== null)
  ) {
    return true;
  }
  if (
    element.tabIndex < 0 ||
    element.hasAttribute('disabled') ||
    element.getAttribute('aria-disabled') === 'true'
  ) {
    return false;
  }

  switch (element.nodeName) {
    case 'A': {
      const anchor = element as HTMLAnchorElement;
      return !!anchor.href && anchor.rel !== 'ignore';
    }
    case 'INPUT': {
      const input = element as HTMLInputElement;
      return !(input.type === 'hidden' || input.type === 'file');
    }
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA': {
      return true;
    }
    default: {
      return false;
    }
  }
};

/**
 * Устанавливает фокус на произвольный элемент.
 *
 * Если элемент не является нативно фокусируемым (по `isFocusable`),
 * временно добавляет `tabindex="-1"` перед вызовом `.focus()`,
 * а затем удаляет его — чтобы не менять постоянный порядок фокуса.
 */
export const focusElement = (el: unknown, options?: FocusOptions): void => {
  if (!isHTMLElement(el)) return;

  let cleanup = false;

  if (!isFocusable(el) && !el.getAttribute('tabindex')) {
    el.setAttribute('tabindex', '-1');
    cleanup = true;
  }

  el.focus(options);

  if (cleanup) {
    el.removeAttribute('tabindex');
  }
};

