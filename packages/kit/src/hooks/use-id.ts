import { computed, getCurrentInstance, inject } from 'vue';
import { isClient } from '@magic/kit/utils';

import type { ComputedRef, InjectionKey } from 'vue';

export interface IdInjection {
  /** Уникальный числовой префикс, отличающий экземпляры приложения друг от друга. */
  prefix: number;
  /** Счётчик, увеличивающийся при каждом вызове `useId`. */
  current: number;
}

const defaultIdInjection: IdInjection = {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
};

/** Injection key для передачи провайдера ID через `app.provide`. */
export const ID_INJECTION_KEY: InjectionKey<IdInjection> = Symbol('MkIdInjection');

/**
 * Возвращает текущий провайдер ID.
 * Если хук вызван вне компонента (нет `getCurrentInstance`), возвращает дефолтный провайдер.
 */
export const useIdInjection = (): IdInjection => {
  return getCurrentInstance() ? inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
};

/**
 * Генерирует уникальный строковый идентификатор для использования в атрибутах `id`/`for`.
 *
 * Идентификатор строится из:
 * - имени компонента (`ComponentOptions.name`),
 * - числового префикса провайдера,
 * - монотонно растущего счётчика.
 *
 * @param deterministicId - Фиксированный ID. Если передан, счётчик не увеличивается.
 * @returns `ComputedRef<string>` с уникальным идентификатором.
 *
 * @example
 * const inputId = useId();
 * // <label :for="inputId">...</label>
 * // <input :id="inputId" />
 */
export const useId = (deterministicId?: string): ComputedRef<string> => {
  const idInjection = useIdInjection();

  if (!isClient && idInjection === defaultIdInjection) {
    console.warn(
      '[use-id] Обнаружен серверный рендеринг без провайдера ID.\n' +
        'Предоставьте провайдер для корректной гидратации:\n' +
        'app.provide(ID_INJECTION_KEY, { prefix: number, current: number })'
    );
  }

  const namespace = getCurrentInstance()?.type?.name ?? '';
  // ID вычисляется один раз во время setup, а не внутри computed,
  // чтобы side effect (current++) не повторялся при каждом обращении к .value.
  const id = deterministicId ?? `${namespace}-id-${idInjection.prefix}-${idInjection.current++}`;

  return computed(() => id);
};
