import { computed, getCurrentInstance } from 'vue';

/**
 * Возвращает реактивный `computed`, который читает проп с именем `name`
 * из текущего экземпляра компонента.
 *
 * Полезен в composable-функциях, которые вызываются вне `setup`-контекста
 * и не имеют прямого доступа к `props`.
 *
 * @template T - Тип значения пропа.
 * @param name - Имя пропа, значение которого нужно получить.
 * @returns `ComputedRef<T | undefined>` — реактивное значение пропа,
 * или `undefined`, если экземпляр недоступен или проп не определён.
 *
 * @example
 * // Внутри composable, который не принимает props напрямую:
 * const disabled = useProp<boolean>('disabled');
 * const isDisabled = computed(() => disabled.value === true);
 */
export const useProp = <T>(name: string) => {
  const vm = getCurrentInstance();
  return computed<T | undefined>(() => {
    const props = vm?.proxy?.$props as Record<string, unknown> | undefined;
    return props?.[name] as T | undefined;
  });
};
