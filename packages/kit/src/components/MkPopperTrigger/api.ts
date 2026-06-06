import type { MaybeComputedElementRef } from '@vueuse/core';

export type Props = {
  /**
   * Указывает на элемент-референс, к которому прикреплен поппер
   */
  virtualRef?: MaybeComputedElementRef;
  /**
   * Указывает, включено ли виртуальное триггерование
   */
  virtualTriggering?: boolean;
  /**
   * Обработчик события наведения мыши
   */
  onMouseenter?: (event: Event) => void;
  /**
   * Обработчик события ухода мыши
   */
  onMouseleave?: (event: Event) => void;
  /**
   * Обработчик события клика
   */
  onClick?: (event: Event) => void;
  /**
   * Обработчик события нажатия клавиши
   */
  onKeydown?: (event: KeyboardEvent) => void;
  /**
   * Обработчик события фокуса
   */
  onFocus?: (event: Event) => void;
  /**
   * Обработчик события потери фокуса
   */
  onBlur?: (event: Event) => void;
  /**
   * Обработчик события контекстного меню
   */
  onContextmenu?: (event: Event) => void;
  /**
   * Идентификатор для связи с контентом поппера через aria-describedby
   */
  id?: string;
  /**
   * Индикатор открытости поппера
   */
  open?: boolean;
};
