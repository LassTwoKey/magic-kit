import { provide } from 'vue';

import type { Ref, InjectionKey, ObjectDirective } from 'vue';

/** Тип элемента, который может хранить forward ref. */
type ForwardRefElement = SVGElement | HTMLElement | null | undefined;

/**
 * Интерфейс, предоставляемый через `provide` для установки forward ref.
 * Используется совместно с `useForwardRefDirective` в дочерних компонентах.
 */
export interface ForwardRefInjection {
  setForwardRef: (el: HTMLElement | null) => void;
}

/**
 * Injection key для передачи `ForwardRefInjection` через provide/inject.
 *
 * @example
 * ```ts
 * // В дочернем компоненте:
 * const { setForwardRef } = inject(FORWARD_REF_INJECTION_KEY)!;
 * ```
 */
export const FORWARD_REF_INJECTION_KEY: InjectionKey<ForwardRefInjection> = Symbol('MkForwardRef');

/**
 * Composable для проброса ссылки на DOM-элемент дочернего компонента наверх.
 *
 * Регистрирует `setForwardRef` через `provide`, чтобы дочерний компонент
 * мог передать свой корневой элемент через директиву `useForwardRefDirective`.
 *
 * @param forwardRef - Реактивная ссылка, в которую будет записан элемент дочернего компонента.
 *
 * @example
 * ```ts
 * // Родительский компонент:
 * const elRef = ref<HTMLElement | null>(null);
 * useForwardRef(elRef);
 * ```
 */
export const useForwardRef = (forwardRef: Ref<ForwardRefElement>): void => {
  const setForwardRef = (el: HTMLElement | null): void => {
    forwardRef.value = el;
  };

  provide(FORWARD_REF_INJECTION_KEY, { setForwardRef });
};

/**
 * Возвращает Vue-директиву, которая передаёт DOM-элемент в `setForwardRef`
 * при монтировании и обновлении, и сбрасывает его при размонтировании.
 *
 * Предназначена для использования в дочернем компоненте совместно с
 * `inject(FORWARD_REF_INJECTION_KEY)`.
 *
 * @param setForwardRef - Функция установки ссылки, полученная через `inject`.
 * @returns Объект директивы для использования в `directives` опции компонента.
 *
 * @example
 * ```ts
 * // Дочерний компонент:
 * const injection = inject(FORWARD_REF_INJECTION_KEY);
 * const vForwardRef = useForwardRefDirective(injection!.setForwardRef);
 * ```
 * ```html
 * <template>
 *   <div v-forward-ref>...</div>
 * </template>
 * ```
 */
export const useForwardRefDirective = (
  setForwardRef: (el: HTMLElement | null) => void
): ObjectDirective<HTMLElement> => {
  return {
    mounted(el) {
      setForwardRef(el);
    },
    updated(el) {
      setForwardRef(el);
    },
    unmounted() {
      setForwardRef(null);
    },
  };
};
