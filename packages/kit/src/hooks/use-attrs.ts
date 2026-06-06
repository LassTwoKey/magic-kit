import { computed, getCurrentInstance } from 'vue';

import type { ComputedRef, Ref } from 'vue';

const DEFAULT_EXCLUDE_KEYS = ['class', 'style'] as const;
const LISTENER_PREFIX = /^on[A-Z]/;

interface UseAttrsParams {
  /**
   * Исключать ли из результата атрибуты-обработчики событий (`onXxx`).
   * @default false
   */
  excludeListeners?: boolean;
  /**
   * Дополнительные ключи атрибутов, которые нужно исключить из результата.
   * Объединяются со стандартными исключениями (`class`, `style`).
   */
  excludeKeys?: Ref<string[]>;
}

/**
 * Возвращает вычисляемый объект `$attrs` текущего компонента,
 * из которого удалены `class`, `style` и, опционально, слушатели событий.
 *
 * Предназначен для использования с `inheritAttrs: false` — позволяет
 * точечно прокидывать атрибуты на нужный внутренний элемент через `v-bind`.
 *
 * @param params - Параметры фильтрации.
 * @returns `ComputedRef` с отфильтрованными атрибутами.
 *
 * @example
 * // В компоненте с inheritAttrs: false:
 * const attrs = useAttrs({ excludeListeners: true });
 * // <input v-bind="attrs" />
 */
export const useAttrs = (params: UseAttrsParams = {}): ComputedRef<Record<string, unknown>> => {
  const { excludeListeners = false, excludeKeys } = params;

  const instance = getCurrentInstance();
  if (!instance) {
    console.warn(
      '[use-attrs] getCurrentInstance() returned null. useAttrs() must be called at the top of a setup function.'
    );
    return computed(() => ({}));
  }

  const allExcludeKeys = computed(() => (excludeKeys?.value ?? []).concat(DEFAULT_EXCLUDE_KEYS));

  return computed(() =>
    Object.fromEntries(
      Object.entries(instance.proxy?.$attrs ?? {}).filter(
        ([key]) =>
          !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))
      )
    )
  );
};
