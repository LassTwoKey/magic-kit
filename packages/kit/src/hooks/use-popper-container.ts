import { computed, onBeforeMount } from 'vue';
import { isClient } from '@magic/kit/utils';

import { useIdInjection } from './use-id';

import type { ComputedRef } from 'vue';

interface PopperContainerIdReturn {
  id: ComputedRef<string>;
  selector: ComputedRef<string>;
}

/**
 * Возвращает стабильный идентификатор и CSS-селектор контейнера для Popper.
 *
 * Не создаёт DOM-элементов — только вычисляет ID на основе префикса инжекции.
 * Для создания контейнера используйте `usePopperContainer`.
 *
 * @remarks
 * Имя неймспейса намеренно оставлено пустым строкой.
 * Получение его через `getCurrentInstance().type.name` вызывает баг в рантайме.
 * TODO: разобраться с источником бага и восстановить неймспейс.
 */
export const usePopperContainerId = (): PopperContainerIdReturn => {
  const idInjection = useIdInjection();

  // TODO: заменить на `getCurrentInstance()?.type?.name ?? ''` после фикса бага
  // При получении имени компонента через getCurrentInstance ломается рендер.
  const namespace = '';

  const id = computed<string>(() => `${namespace}-popper-container-${idInjection.prefix}`);
  const selector = computed<string>(() => `#${id.value}`);

  return { id, selector };
};

/**
 * Создаёт `div`-контейнер с заданным id и добавляет его в `document.body`.
 * Вызывать только на клиенте.
 *
 * @param id - Значение атрибута `id` для создаваемого элемента.
 */
const createContainer = (id: string): HTMLDivElement => {
  const container = document.createElement('div');
  container.id = id;
  document.body.appendChild(container);
  return container;
};

/**
 * Composable для инициализации глобального контейнера для Popper-элементов.
 *
 * При монтировании проверяет наличие контейнера в DOM и создаёт его при необходимости.
 * Безопасен для SSR: создание DOM-элементов защищено проверкой `isClient`.
 *
 * @remarks
 * В тестовом окружении (`NODE_ENV === 'test'`) контейнер пересоздаётся при каждом
 * монтировании, чтобы обеспечить изоляцию между тест-кейсами.
 *
 * @example
 * ```ts
 * const { id, selector } = usePopperContainer();
 * // selector.value → '#-popper-container-1234'
 * // Контейнер будет добавлен в body при монтировании компонента.
 * ```
 */
export const usePopperContainer = (): PopperContainerIdReturn => {
  const { id, selector } = usePopperContainerId();

  onBeforeMount(() => {
    if (!isClient) return;

    const isTestEnv = import.meta.env.MODE === 'test';

    // В тестовом окружении всегда пересоздаём контейнер для изоляции между тестами.
    // В остальных случаях создаём только если контейнер ещё не существует в DOM.
    if (isTestEnv || !document.body.querySelector(selector.value)) {
      createContainer(id.value);
    }
  });

  return { id, selector };
};
