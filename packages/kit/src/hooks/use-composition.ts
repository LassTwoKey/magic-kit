import { nextTick, ref } from 'vue';
import { isKorean } from '@magic/kit/utils';

import type { Ref, SetupContext } from 'vue';

interface Emits {
  compositionstart: (evt: CompositionEvent) => void;
  compositionupdate: (evt: CompositionEvent) => void;
  compositionend: (evt: CompositionEvent) => void;
}

interface UseCompositionParams {
  /**
   * Callback, вызываемый после завершения композиционного ввода.
   * Выполняется в следующем тике (`nextTick`), чтобы значение `input`
   * успело обновиться до вызова обработчика.
   */
  afterComposition: (event: CompositionEvent) => void;
  /**
   * Функция `emit` компонента для проксирования событий `compositionstart`,
   * `compositionupdate`, `compositionend` наружу. Необязательна —
   * хук можно использовать без emit событий компонента.
   */
  emit?: SetupContext<Emits>['emit'];
}

interface UseCompositionReturn {
  /** `true`, когда идёт активный IME-ввод (между `compositionstart` и `compositionend`). */
  isComposing: Ref<boolean>;
  /**
   * Универсальный обработчик для событий `compositionupdate` и `compositionend`.
   * Удобен, когда оба события навешиваются на один слушатель.
   */
  handleComposition: (event: CompositionEvent) => void;
  /** Обработчик события `compositionstart`. */
  handleCompositionStart: (event: CompositionEvent) => void;
  /**
   * Обработчик события `compositionupdate`.
   * Для корейского IME (`isKorean`) сразу сбрасывает `isComposing` в `false`,
   * так как корейский браузерный IME не генерирует `compositionend` между символами.
   */
  handleCompositionUpdate: (event: CompositionEvent) => void;
  /** Обработчик события `compositionend`. */
  handleCompositionEnd: (event: CompositionEvent) => void;
}

/**
 * Управляет состоянием IME-композиционного ввода (иероглифы, корейский и др.).
 *
 * Во время активной IME-сессии (`isComposing === true`) ввод считается
 * незавершённым и не должен применяться к модели. После `compositionend`
 * вызывает `afterComposition`, чтобы применить итоговое значение.
 *
 * @param params - Параметры хука.
 * @returns Реактивный флаг `isComposing` и набор обработчиков событий.
 *
 * @example
 * const { isComposing, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } =
 *   useComposition({ emit, afterComposition: handleInput });
 */
export function useComposition({
  afterComposition,
  emit,
}: UseCompositionParams): UseCompositionReturn {
  const isComposing = ref(false);

  const handleCompositionStart = (event: CompositionEvent): void => {
    emit?.('compositionstart', event);
    isComposing.value = true;
  };

  const handleCompositionUpdate = (event: CompositionEvent): void => {
    emit?.('compositionupdate', event);
    const text = (event.target as HTMLInputElement | HTMLTextAreaElement)?.value ?? '';
    const lastCharacter = text[text.length - 1] ?? '';
    isComposing.value = !isKorean(lastCharacter);
  };

  const handleCompositionEnd = (event: CompositionEvent): void => {
    emit?.('compositionend', event);
    if (isComposing.value) {
      isComposing.value = false;
      void nextTick(() => afterComposition(event));
    }
  };

  const handleComposition = (event: CompositionEvent): void => {
    if (event.type === 'compositionend') {
      handleCompositionEnd(event);
    } else {
      handleCompositionUpdate(event);
    }
  };

  return {
    isComposing,
    handleComposition,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
  };
}
