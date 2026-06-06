import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { getClosestButton, getValueFromEvent, snapToStep } from '../utils';

/**
 * Параметры composable для управления перетаскиванием слайдера.
 */
interface UseSliderDragOptions {
  /** Реактивная ссылка на минимальное значение. */
  min: { value: number };
  /** Реактивная ссылка на максимальное значение. */
  max: { value: number };
  /** Реактивная ссылка на шаг. */
  step: { value: number };
  /** Реактивная ссылка на признак режима диапазона. */
  range: { value: boolean };
  /** Реактивная ссылка на признак отключения. */
  disabled: { value: boolean };
  /** Реактивная ссылка на признак вертикального режима. */
  vertical: { value: boolean };
  /** Реактивная ссылка на точность (знаки после запятой). */
  precision: { value: number };
  /** Ссылка на DOM-элемент дорожки. */
  runwayRef: { value: HTMLElement | undefined };
  /** Computed-значение первой кнопки. */
  firstValue: { value: number };
  /** Computed-значение второй кнопки. */
  secondValue: { value: number };
  /** Функция emit компонента. */
  emit: {
    (e: 'update:modelValue', val: number | number[]): void;
    (e: 'change', val: number | number[]): void;
  };
}

/**
 * Composable для управления перетаскиванием кнопок слайдера.
 *
 * Инкапсулирует логику мышиных и тач-событий, определение ближайшей
 * кнопки, клавиатурную навигацию и управление курсором при перетаскивании.
 *
 * @param options - Параметры composable.
 * @returns Реактивное состояние и обработчики событий.
 */
export function useSliderDrag(options: UseSliderDragOptions) {
  const {
    min,
    max,
    step,
    range,
    disabled,
    vertical,
    precision,
    runwayRef,
    firstValue,
    secondValue,
    emit,
  } = options;

  const draggingIndex = ref(-1);
  const isDragging = computed(() => draggingIndex.value !== -1);

  /** Приводит значение к ближайшему шагу с текущими параметрами. */
  const snap = (val: number) => snapToStep(val, min.value, max.value, step.value, precision.value);

  /** Отправляет событие обновления model-value. */
  const emitUpdate = (first: number, second?: number) => {
    if (range.value) {
      emit('update:modelValue', [first, second!]);
    } else {
      emit('update:modelValue', first);
    }
  };

  // --- Обработчики событий ---

  /** Обработка клика по дорожке — перемещает ближайшую кнопку. */
  const onRunwayClick = (event: MouseEvent) => {
    if (disabled.value) return;
    if (!runwayRef.value) return;

    const value = getValueFromEvent(
      event,
      runwayRef.value,
      vertical.value,
      min.value,
      max.value,
      snap
    );
    const index = getClosestButton(value, firstValue.value, secondValue.value, range.value);

    if (range.value) {
      if (index === 0) {
        emitUpdate(value, secondValue.value);
      } else {
        emitUpdate(firstValue.value, value);
      }
    } else {
      emitUpdate(value);
    }

    draggingIndex.value = index;
    bindEvents();
  };

  /** Начало перетаскивания мышью. */
  const onButtonDown = (_event: MouseEvent, index: number) => {
    if (disabled.value) return;
    draggingIndex.value = index;
    bindEvents();
  };

  /** Начало перетаскивания тачем. */
  const onTouchStart = (_event: TouchEvent, index: number) => {
    if (disabled.value) return;
    draggingIndex.value = index;
    bindTouchEvents();
  };

  /** Обработка движения при перетаскивании. */
  const onDragging = (event: MouseEvent | TouchEvent) => {
    if (!runwayRef.value) return;

    const value = getValueFromEvent(
      event,
      runwayRef.value,
      vertical.value,
      min.value,
      max.value,
      snap
    );

    if (!range.value) {
      emitUpdate(value);
      return;
    }

    if (draggingIndex.value === 0) {
      emitUpdate(value, secondValue.value);
    } else {
      emitUpdate(firstValue.value, value);
    }
  };

  /** Завершение перетаскивания — отправляет `change`. */
  const onDragEnd = () => {
    if (draggingIndex.value !== -1) {
      emit('change', range.value ? [firstValue.value, secondValue.value] : firstValue.value);
    }
    draggingIndex.value = -1;
    unbindEvents();
  };

  // --- Привязка событий ---

  const bindEvents = () => {
    document.addEventListener('mousemove', onDragging);
    document.addEventListener('mouseup', onDragEnd);
  };

  const bindTouchEvents = () => {
    document.addEventListener('touchmove', onDragging, { passive: false });
    document.addEventListener('touchend', onDragEnd);
  };

  const unbindEvents = () => {
    document.removeEventListener('mousemove', onDragging);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragging);
    document.removeEventListener('touchend', onDragEnd);
  };

  /** Клавиатурная навигация (стрелки, Home, End). */
  const onKeydown = (event: KeyboardEvent, index: number) => {
    if (disabled.value) return;

    const current = index === 0 ? firstValue.value : secondValue.value;
    let newValue: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        newValue = snap(current + step.value);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        newValue = snap(current - step.value);
        break;
      case 'Home':
        event.preventDefault();
        newValue = min.value;
        break;
      case 'End':
        event.preventDefault();
        newValue = max.value;
        break;
      default:
        return;
    }

    if (range.value) {
      if (index === 0) {
        emitUpdate(newValue, secondValue.value);
      } else {
        emitUpdate(firstValue.value, newValue);
      }
      emit('change', [firstValue.value, secondValue.value]);
    } else {
      emitUpdate(newValue);
      emit('change', newValue);
    }
  };

  // --- Курсор при перетаскивании ---

  watch(isDragging, (dragging) => {
    document.body.style.cursor = dragging ? 'grabbing' : '';
    document.body.style.userSelect = dragging ? 'none' : '';
  });

  onBeforeUnmount(() => {
    unbindEvents();
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  return {
    draggingIndex,
    isDragging,
    onRunwayClick,
    onButtonDown,
    onTouchStart,
    onKeydown,
  };
}
