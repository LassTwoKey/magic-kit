import type { Component, ShallowRef } from 'vue';
import type { Size, InputModelModifiers } from '@magic/kit/types';

export type Props = {
  /**
   * Размер
   */
  size?: Size;
  /**
   * Disabled
   */
  disabled?: boolean;
  /**
   * Привязка значения
   */
  modelValue?: string | number;
  /**
   * v-model модификаторы Vue modifiers
   */
  modelModifiers?: InputModelModifiers;
  /**
   * Нативный maxlength
   */
  maxlength?: number;
  /**
   * Нативный minlength
   */
  minlength?: number;
  /**
   * Тип инпута
   */
  type?: string;
  /**
   * Нативный autocomplete
   */
  autocomplete?: string;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * Нативный form
   */
  form?: string;
  /**
   * Нативный readonly
   */
  readonly?: boolean;
  /**
   * Включение отображения кнопки очистки значения
   */
  clearable?: boolean;
  /**
   * Иконка очистки значения
   */
  clearIcon?: string | Component;
  /**
   * Иконка после поля ввода
   */
  suffixIcon?: string | Component;
  /**
   * Иконка перед полем ввода
   */
  prefixIcon?: string | Component;
  /**
   * Tabindex
   */
  tabindex?: number;
  /**
   *Нативный autofocus
   */
  autofocus?: boolean;
  /**
   * Нативный name
   */
  name?: string;
  /**
   * Нативный label для доступности
   */
  label?: string;
  /**
   * Нативный ariaLabel для доступности
   */
  ariaLabel?: string;
  /**
   * Нативный ariaLabelledby для доступности
   */
  ariaLabelledby?: string;
  /**
   * Нативный ariaDescribedby для доступности
   */
  ariaDescribedby?: string;
  /**
   * Нативный required для доступности
   */
  required?: boolean;
  /**
   * Состояние ошибки
   */
  invalid?: boolean;
};

export type Emits = {
  /**
   * Emit для значения
   */
  'update:modelValue': [val: string];
  /**
   * Emit срабатывает при изменении значения Input
   */
  input: [val: string];
  /**
   * Emit срабатывает при потере фокуса или нажатии Enter, только если значение modelValue изменилось
   */
  change: [value: string, event?: Event];
  /**
   * Emit срабатывает при получении фокуса Input
   */
  focus: [val: FocusEvent];
  /**
   * Emit срабатывает при потере фокуса Input
   */
  blur: [val: FocusEvent];
  /**
   * Emit срабатывает при очистке Input кликом по кнопке очистки
   */
  clear: [val: void];
  /**
   * Emit срабатывает, когда указатель мыши покидает элемент Input
   */
  mouseleave: [val: MouseEvent];
  /**
   * Emit срабатывает, когда указатель мыши наводится на элемент Input
   */
  mouseenter: [val: MouseEvent];
  /**
   * Emit срабатывает при нажатии клавиши
   */
  keydown: [val: KeyboardEvent];
  /**
   * Emit срабатывает при начале композиционного ввода (например, ввод иероглифов)
   */
  compositionstart: [val: CompositionEvent];
  /**
   * Emit срабатывает при обновлении композиционного ввода
   */
  compositionupdate: [val: CompositionEvent];
  /**
   * Emit 	срабатывает при завершении композиционного ввода
   */
  compositionend: [val: CompositionEvent];
};

export type Slots = {
  prepend?: (props?: any) => any;
  append?: (props?: any) => any;
  clearIcon?: (props?: any) => any;
  prefixIcon?: (props?: any) => any;
  suffixIcon?: (props?: any) => any;
};

export type Exposes = {
  /**
   * HTML input element
   */
  input: ShallowRef<HTMLInputElement | null>;
  /**
   * Is input composing
   */
  isComposing: ShallowRef<boolean>;
  /**
   * HTML input element native method
   */
  focus: () => void;
  /**
   * HTML input element native method
   */
  blur: () => void;
  /**
   * HTML input element native method
   */
  select: () => void;
  /**
   * Clear input value
   */
  clear: () => void;
};
