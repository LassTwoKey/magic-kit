import type { PopperOptions } from './type';

import type { CSSProperties, Ref, StyleValue } from 'vue';
import type { Props as MkPopperProps } from '@magic/kit/components/MkPopper/api';
import type { Instance, Placement, PositioningStrategy } from '@popperjs/core';
import type { MaybeComputedElementRef } from '@vueuse/core';

export interface PopperCoreConfigProps {
  /**
   * Отступ от границ
   */
  boundariesPadding?: number;
  /**
   * Альтернативные позиции при невозможности размещения
   */
  fallbackPlacements?: Placement[];
  /**
   * Использовать GPU ускорение
   */
  gpuAcceleration?: boolean;
  /**
   * Отступ от элемента
   */
  offset?: number;
  /**
   * Позиция tooltip
   */
  placement?: Placement;
  /**
   * Дополнительные опции для Popper.js
   */
  popperOptions?: PopperOptions;
  /**
   * Стратегия позиционирования
   */
  strategy?: PositioningStrategy;
}

export interface Props extends PopperCoreConfigProps, MkPopperProps {
  /**
   * Смещение стрелки
   */
  arrowOffset?: number;
  /**
   * ID
   */
  id?: string;
  /**
   * Стили для DOM элемента контента поппера
   */
  style?: CSSProperties | CSSProperties[];
  /**
   * Классы для DOM элемента контента поппера
   */
  className?: string | string[] | Record<string, boolean>;
  /**
   * Тема tooltip
   */
  effect?: string | null;
  /**
   * Видимость tooltip
   */
  visible?: boolean;
  /**
   * Можно ли навести курсор на tooltip
   */
  enterable?: boolean;
  /**
   * Чистый режим (без стилей)
   */
  pure?: boolean;
  /**
   * Фокусироваться ли на tooltip при его показе
   */
  focusOnShow?: boolean;
  /**
   * Трапить ли фокус внутри tooltip
   */
  trapping?: boolean;
  /**
   * Классы для DOM элемента контента поппера
   */
  popperClass?: string | string[] | object;
  /**
   * Стили для DOM элемента контента поппера
   */
  popperStyle?: StyleValue | CSSProperties | CSSProperties[];
  /**
   * Ссылка на DOM элемент, к которому будет привязан поппер
   */
  referenceEl?: MaybeComputedElementRef;
  /**
   * Ссылка на DOM элемент, который будет триггером для поппера
   */
  triggerTargetEl?: object;
  /**
   * Останавливать ли события мыши на поппере, чтобы они не распространялись на элементы под ним
   */
  stopPopperMouseEvent?: boolean;
  /**
   * Использовать ли виртуальное триггеринг (для случаев, когда нет реального DOM элемента-триггера)
   */
  virtualTriggering?: boolean;
  /**
   * z-index для DOM элемента контента поппера
   */
  zIndex?: number;
  /**
   * Зацикливание фокуса
   */
  loop?: boolean;
  /**
   * ARIA роль для контента Popper
   */
  ariaLabel?: string;
}

export type Emits = {
  /**
   * 	Emit срабатывает при получении фокуса
   */
  focus: [];
  /**
   * 	Emit срабатывает при потере фокуса
   */
  blur: [];
  /**
   * 	Emit срабатывает при очистке кликом по кнопке очистки
   */
  clear: [];
  /**
   *   Emit срабатывает при закрытии
   */
  close: [];
  /**
   * 	Emit срабатывает, когда указатель мыши покидает элемент
   */
  mouseleave: [val: MouseEvent];
  /**
   * 	Emit срабатывает, когда указатель мыши наводится на элемент
   */
  mouseenter: [val: MouseEvent];
};

export type Exposes = {
  /**
   * Ссылка на DOM элемент контента поппера
   */
  popperContentRef: Ref<HTMLElement | undefined> | undefined;
  /**
   * Ссылка на DOM элемент стрелки поппера
   */
  popperInstanceRef: Ref<Instance | undefined>;
  /**
   * Метод для обновления поппера
   */
  updatePopper: (shouldUpdateZIndex?: boolean) => void;
  /**
   * contentStyle для передачи в DOM элемент контента поппера
   */
  contentStyle: Ref<StyleValue>;
};
