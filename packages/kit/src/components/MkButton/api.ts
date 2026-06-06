import type { Component } from 'vue';
import type { IconSide, Size, Variant } from '@magic/kit/types';

export type Props = {
  /**
   * Вариант кнопки
   */
  variant?: Variant;
  /**
   * Текст на кнопке
   */
  label?: string;
  /**
   * Размер кнопки (для текстовых)
   */
  size?: Size;
  /**
   * Иконка SVG Vue
   */
  icon?: string | Component;
  /**
   * Сторона размещения иконки
   */
  iconSide?: IconSide;
  /**
   * Тэг или компонент кнопки
   */
  as?: 'a' | 'button' | Component;
  /**
   * Кнопка с обводкой
   */
  outline?: boolean;
  /**
   * Текстовая кнопка
   */
  text?: boolean;
  /**
   * Тонкий шрифт на кнопке (для текстовых)
   */
  thin?: boolean;
  /**
   * Заблокировать кнопку
   */
  disabled?: boolean;
  /**
   * Определяет строковое значение, которое обозначает текущий элемент
   */
  ariaLabel?: string;
  /**
   * Определяет элемент (или элементы), который обозначает текущий элемент
   */
  ariaLabelledby?: string;
  /**
   * Title у кнопки
   */
  title?: string;
};

export type Slots = {
  /**
   * Slot иконки
   */
  icon: any;
};

export type Emits = {
  /**
   * Emit для click
   */
  click: [event: MouseEvent];
  /**
   * Emit для blur
   */
  blur: [event: FocusEvent];
  /**
   * Emit для focus
   */
  focus: [event: FocusEvent];
};
