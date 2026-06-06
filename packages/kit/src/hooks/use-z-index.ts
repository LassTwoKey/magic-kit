import { computed, getCurrentInstance, inject, ref, unref } from 'vue';
import { isClient, isNumber } from '@magic/kit/utils';

import type { MaybeRef, InjectionKey } from 'vue';

interface ZIndexContext {
  current: number;
}

/**
 * Фолбэк-контекст для окружений без провайдера `ZINDEX_INJECTION_KEY`.
 * Намеренно является общим синглтоном — все потребители без провайдера
 * используют единый счётчик.
 */
const initial: ZIndexContext = { current: 0 };

/**
 * Глобальный реактивный счётчик z-index.
 * Синхронизируется с `increasingInjection.current` при каждом вызове `nextZIndex`.
 */
const zIndex = ref<number>(0);

/** Базовое значение z-index по умолчанию. */
export const defaultInitialZIndex = 2000;

/**
 * Injection key для передачи общего счётчика z-index через provide/inject.
 * Необходим для SSR, чтобы каждый запрос имел изолированный счётчик.
 *
 * @example
 * ```ts
 * // main.ts или в корневом компоненте:
 * app.provide(ZINDEX_INJECTION_KEY, { current: 0 });
 * ```
 */
export const ZINDEX_INJECTION_KEY: InjectionKey<ZIndexContext> = Symbol('MkZIndexContextKey');

/**
 * Injection key для локального переопределения базового z-index
 * в поддереве компонентов.
 *
 * @example
 * ```ts
 * provide(zIndexContextKey, 3000);
 * ```
 */
export const zIndexContextKey: InjectionKey<MaybeRef<number>> = Symbol('zIndexContextKey');

/**
 * Composable для получения и инкремента z-index с поддержкой SSR
 * и локального переопределения через provide/inject.
 *
 * Логика выбора базового z-index (в порядке приоритета):
 * 1. `zIndexOverrides` если передан и является числом
 * 2. Значение из `zIndexContextKey` если предоставлено в дереве
 * 3. `defaultInitialZIndex` (2000)
 *
 * @param zIndexOverrides - Явное переопределение базового z-index.
 *                          Принимает реактивное или статическое значение.
 *                          `0` является валидным значением.
 *
 * @example
 * ```ts
 * const { currentZIndex, nextZIndex } = useZIndex();
 *
 * // Получить следующий z-index и увеличить счётчик:
 * const zIdx = nextZIndex();
 *
 * // С явным базовым значением:
 * const { currentZIndex } = useZIndex(3000);
 * ```
 */
export const useZIndex = (zIndexOverrides?: MaybeRef<number | undefined>) => {
  const instance = getCurrentInstance();

  const increasingInjection = instance ? inject(ZINDEX_INJECTION_KEY, initial) : initial;

  const zIndexInjection =
    zIndexOverrides !== undefined
      ? zIndexOverrides
      : instance
        ? inject(zIndexContextKey, undefined)
        : undefined;

  const initialZIndex = computed<number>(() => {
    const zIndexFromInjection = unref(zIndexInjection);
    return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
  });

  const currentZIndex = computed<number>(() => initialZIndex.value + zIndex.value);

  /**
   * Инкрементирует глобальный счётчик и возвращает следующий z-index.
   * Каждый вызов гарантированно возвращает значение выше предыдущего.
   */
  const nextZIndex = (): number => {
    increasingInjection.current++;
    zIndex.value = increasingInjection.current;
    return currentZIndex.value;
  };

  if (!isClient && instance && !inject(ZINDEX_INJECTION_KEY)) {
    console.warn(
      '[MkZIndex] SSR detected without z-index provider. ' +
        'This may cause hydration mismatch.\n' +
        'Fix: app.provide(ZINDEX_INJECTION_KEY, { current: 0 })'
    );
  }

  return {
    initialZIndex,
    currentZIndex,
    nextZIndex,
  };
};
