import { computed, getCurrentInstance, onMounted, watch } from 'vue';
import { isBoolean, isClient, isFunction } from '@magic/kit/utils';

import type { Ref } from 'vue';

/** Общий дескриптор Boolean prop для v-model биндинга. */
const makeProp = () => Object.freeze({ type: Boolean, default: null });

/** Общий дескриптор Function prop для обработчика update события. */
const makeEvent = () => Object.freeze({ type: Function });

/**
 * Опции для `useModelToggle`.
 */
interface UseModelToggleOptions {
  /** Реактивный индикатор текущего состояния (открыт/закрыт). */
  indicator: Ref<boolean>;
  /**
   * Опциональный ref, в который записывается событие,
   * ставшее причиной последнего переключения.
   */
  toggleReason?: Ref<Event | undefined>;
  /**
   * Если `true`, скрывает элемент при смене маршрута.
   * Работает только при наличии Vue Router в приложении.
   */
  shouldHideWhenRouteChanges?: Ref<boolean>;
  /**
   * Дополнительная проверка перед показом.
   * Если функция вернёт `false`, `show()` будет проигнорирован.
   * Не влияет на `hide()`.
   */
  shouldProceed?: () => boolean;
  /** Вызывается после успешного показа элемента. */
  onShow?: (event?: Event) => void;
  /** Вызывается после успешного скрытия элемента. */
  onHide?: (event?: Event) => void;
}

export type { UseModelToggleOptions };

/**
 * Фабрика composable'а для управления состоянием показа/скрытия
 * с поддержкой произвольного v-model.
 *
 * Создаёт связанные `useModelToggle`, `useModelToggleProps` и `useModelToggleEmits`
 * для указанного имени модели. По умолчанию экспортируется вариант для `modelValue`.
 *
 * Логика работы:
 * - Если на компоненте есть `v-model` (т.е. обработчик `onUpdate:<name>`),
 *   состояние управляется снаружи через emit.
 * - Если `v-model` отсутствует, состояние управляется внутренним `indicator`.
 *
 * @param name - Имя модели (например, `'modelValue'` или `'visible'`).
 *
 * @example
 * ```ts
 * // Для нестандартного v-model:
 * const { useModelToggle, useModelToggleProps, useModelToggleEmits } =
 *   createModelToggleComposable('visible');
 *
 * // Стандартный вариант уже экспортирован:
 * import { useModelToggle } from './use-model-toggle';
 * ```
 */
export const createModelToggleComposable = (name: string) => {
  const updateEventKey = `update:${name}`;
  const updateEventKeyRaw = `onUpdate:${name}`;
  const useModelToggleEmits = [updateEventKey];
  const useModelToggleProps = {
    [name]: makeProp(),
    [updateEventKeyRaw]: makeEvent(),
  };

  /**
   * Composable для управления состоянием показа/скрытия компонента.
   * Должен вызываться внутри `setup()`.
   *
   * @throws {Error} Если вызван вне компонентного контекста.
   */
  const useModelToggle = ({
    indicator,
    toggleReason,
    shouldHideWhenRouteChanges,
    shouldProceed,
    onShow,
    onHide,
  }: UseModelToggleOptions) => {
    const instance = getCurrentInstance();
    if (!instance) {
      throw new Error('useModelToggle must be called within a setup function');
    }

    const { emit, props } = instance;
    const hasUpdateHandler = computed(() => isFunction(instance.vnode.props?.[updateEventKeyRaw]));
    const isModelBindingAbsent = computed(() => props[name] === null);

    /** Выставляет indicator в true и вызывает onShow без дополнительных проверок. */
    const doShow = (event?: Event) => {
      if (indicator.value === true) return;

      indicator.value = true;
      if (toggleReason) toggleReason.value = event;
      onShow?.(event);
    };

    /** Выставляет indicator в false и вызывает onHide без дополнительных проверок. */
    const doHide = (event?: Event) => {
      if (indicator.value === false) return;

      indicator.value = false;
      if (toggleReason) toggleReason.value = event;
      onHide?.(event);
    };

    /**
     * Показывает элемент.
     * Учитывает `disabled`, `shouldProceed` и наличие `v-model`.
     * Работает только на клиенте.
     */
    const show = (event?: Event) => {
      if (!isClient) return;
      if (props.disabled === true || (isFunction(shouldProceed) && !shouldProceed())) return;

      if (hasUpdateHandler.value) {
        emit(updateEventKey, true);
      }

      if (isModelBindingAbsent.value || !hasUpdateHandler.value) {
        doShow(event);
      }
    };

    /**
     * Скрывает элемент.
     * Учитывает `disabled` и наличие `v-model`.
     * Работает только на клиенте.
     *
     * Примечание: `shouldProceed` намеренно не проверяется при скрытии.
     */
    const hide = (event?: Event) => {
      if (!isClient || props.disabled === true) return;

      if (hasUpdateHandler.value) {
        emit(updateEventKey, false);
      }

      if (isModelBindingAbsent.value || !hasUpdateHandler.value) {
        doHide(event);
      }
    };

    /**
     * Синхронизирует внутренний indicator с входящим значением prop.
     * Если компонент задизейблен и prop пытается выставить `true` — эмитит `false` обратно.
     *
     * @param val - Новое значение prop. Игнорируется если не boolean.
     */
    const onChange = (val: unknown) => {
      if (!isBoolean(val)) return;

      if (props.disabled && val) {
        if (hasUpdateHandler.value) {
          emit(updateEventKey, false);
        }
      } else if (indicator.value !== val) {
        if (val) {
          doShow();
        } else {
          doHide();
        }
      }
    };

    /** Переключает состояние: скрывает если открыт, показывает если скрыт. */
    const toggle = () => {
      if (indicator.value) {
        hide();
      } else {
        show();
      }
    };

    watch(() => props[name], onChange);

    if (
      shouldHideWhenRouteChanges &&
      instance.appContext.config.globalProperties.$route !== undefined
    ) {
      const route = computed(
        () =>
          (instance.proxy as Record<string, unknown> | null)?.$route as
            | { fullPath?: string }
            | undefined
      );

      // Следим за fullPath, а не за всем объектом роута — spread создаёт
      // новую ссылку на каждый вызов геттера и триггерит вотчер на каждый рендер.
      watch(
        () => route.value?.fullPath,
        () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide();
          }
        }
      );
    }

    onMounted(() => {
      onChange(props[name]);
    });

    return {
      hide,
      show,
      toggle,
      hasUpdateHandler,
    };
  };

  return {
    useModelToggle,
    useModelToggleProps,
    useModelToggleEmits,
  };
};

const { useModelToggle, useModelToggleProps, useModelToggleEmits } =
  createModelToggleComposable('modelValue');

export { useModelToggle, useModelToggleEmits, useModelToggleProps };
