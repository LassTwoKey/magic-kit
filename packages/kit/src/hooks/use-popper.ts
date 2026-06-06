import { computed, onBeforeUnmount, ref, shallowRef, unref, watch } from 'vue';
import { createPopper } from '@popperjs/core';

import type { Ref, ShallowRef } from 'vue';
import type { Instance, Modifier, Options, State } from '@popperjs/core';

type ElementStyles = Partial<CSSStyleDeclaration> & Record<string, string>;

/**
 * Реактивное состояние Popper: стили и атрибуты для каждого элемента (popper, arrow и др.).
 */
interface PopperStates {
  styles: Record<string, ElementStyles>;
  attributes: Record<string, Record<string, string> | undefined>;
}

/**
 * Извлекает стили и атрибуты из внутреннего состояния Popper.js.
 * Используется в модификаторе `updateState` для синхронизации с Vue-реактивностью.
 */
function deriveState(state: State): PopperStates {
  const elements = Object.keys(state.elements) as Array<keyof typeof state.elements>;

  const styles = Object.fromEntries(
    elements.map((element) => [element, (state.styles[element] as ElementStyles) ?? {}])
  ) as Record<string, ElementStyles>;

  const attributes = Object.fromEntries(
    elements.map((element) => [element, state.attributes[element]])
  ) as Record<string, Record<string, string> | undefined>;

  return { styles, attributes };
}

/**
 * Composable-обёртка над Popper.js с реактивными стилями и атрибутами.
 *
 * Создаёт инстанс Popper при появлении обоих элементов, пересоздаёт его
 * при их смене, и уничтожает при размонтировании компонента.
 *
 * Стили и атрибуты управляются через Vue-реактивность (модификатор `applyStyles` отключён).
 *
 * @param referenceElementRef - Ref на якорный элемент (относительно которого позиционируется popper).
 * @param popperElementRef - Ref на позиционируемый элемент.
 *                           Если не передан или `undefined`, инстанс не создаётся.
 * @param opts - Опции Popper.js. Принимает реактивный или статический объект.
 *
 * @returns Объект с реактивными стилями, атрибутами, состоянием и методами управления.
 *
 * @example
 * ```ts
 * const { styles, attributes, update } = usePopper(referenceRef, popperRef, {
 *   placement: 'top',
 *   strategy: 'fixed',
 * });
 * ```
 */
export const usePopper = (
  referenceElementRef: Ref<HTMLElement | SVGElement | null | undefined>,
  popperElementRef?: Ref<HTMLElement | undefined>,
  opts: Ref<Partial<Options>> | Partial<Options> = {}
) => {
  const states = ref<PopperStates>({
    styles: {
      popper: {
        position: unref(opts).strategy ?? 'absolute',
        left: '0',
        top: '0',
      },
      arrow: {
        position: 'absolute',
      },
    },
    attributes: {},
  });

  /**
   * Кастомный модификатор Popper.js, синхронизирующий стили и атрибуты
   * с реактивным `states` вместо прямого применения к DOM.
   * Замыкается на `states`, поэтому объявлен внутри composable.
   */
  const stateUpdater: Modifier<'updateState', object> = {
    name: 'updateState',
    enabled: true,
    phase: 'write',
    fn: ({ state }: { state: State }) => {
      Object.assign(states.value, deriveState(state));
    },
    requires: ['computeStyles'],
  };

  const options = computed<Options>(() => {
    const { onFirstUpdate, placement, strategy, modifiers } = unref(opts);

    return {
      onFirstUpdate,
      placement: placement ?? 'bottom',
      strategy: strategy ?? 'absolute',
      modifiers: [...(modifiers ?? []), stateUpdater, { name: 'applyStyles', enabled: false }],
    };
  });

  const instanceRef: ShallowRef<Instance | undefined> = shallowRef();

  /** Уничтожает текущий инстанс Popper, если он существует. */
  const destroy = () => {
    if (!instanceRef.value) return;

    instanceRef.value.destroy();
    instanceRef.value = undefined;
  };

  // Обновляем опции без пересоздания инстанса если элементы не менялись.
  watch(
    options,
    (newOptions) => {
      void unref(instanceRef)?.setOptions(newOptions);
    },
    { deep: true }
  );

  // Пересоздаём инстанс при смене reference или popper элементов.
  watch([referenceElementRef, popperElementRef] as const, ([referenceElement, popperElement]) => {
    destroy();
    if (!referenceElement || !popperElement) return;

    instanceRef.value = createPopper(
      referenceElement as unknown as Element,
      popperElement as unknown as HTMLElement,
      unref(options)
    );
  });

  onBeforeUnmount(destroy);

  return {
    /** Полное состояние инстанса Popper.js (snapshot, не реактивный). */
    state: computed(() => ({ ...(unref(instanceRef)?.state ?? {}) })),
    /** Реактивные стили для каждого элемента (popper, arrow и др.). */
    styles: computed(() => unref(states).styles),
    /** Реактивные data-атрибуты для каждого элемента. */
    attributes: computed(() => unref(states).attributes),
    /**
     * Запускает асинхронный пересчёт позиции.
     * @returns Promise со следующим состоянием или `undefined` если инстанс не создан.
     */
    update: (): Promise<Partial<State>> | undefined => unref(instanceRef)?.update(),
    /**
     * Запускает синхронный пересчёт позиции.
     * Используется когда нужен немедленный результат без ожидания микротаска.
     */
    forceUpdate: (): void => unref(instanceRef)?.forceUpdate(),
    /** Ref на инстанс Popper.js для прямого доступа при необходимости. */
    instanceRef: computed(() => unref(instanceRef)),
  };
};
