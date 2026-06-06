import type { Resize } from './types';

import type { ShallowRef } from 'vue';
import type { Size, InputModelModifiers } from '@magic/kit/types';

export type Props = {
  /**
   * Заблокировать взаимодействие со textarea
   */
  disabled?: boolean;
  /**
   * Привязанное значение
   */
  modelValue?: string;
  /**
   * v-model модификаторы Vue modifiers (.lazy / .number / .trim)
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
   * Нативный autocomplete
   */
  autocomplete?: 'off' | 'on';
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
   * tabindex
   */
  tabindex?: number;
  /**
   * Нативный autofocus
   */
  autofocus?: boolean;
  /**
   * Нативный name
   */
  name?: string;
  /**
   * Состояние ошибки
   */
  invalid?: boolean;
  /**
   * Кол-во строк
   */
  rows?: number;
  /**
   * Возможность растягивать поле пользователем, нативный resize
   */
  resize?: Resize;
  /**
   * Автоматически менять размер под контент
   */
  autosize?: boolean;
  /**
   * Нативный size
   */
  size?: Size;
};

export type Emits = {
  /**
   * Emit для значения
   */
  'update:modelValue': [value: string];
  /**
   * Emit срабатывает при изменении значения Input
   */
  input: [value: string];
  /**
   * Emit срабатывает при потере фокуса или нажатии Enter, только если значение modelValue изменилось
   */
  change: [value: string];
  /**
   * Emit срабатывает при получении фокуса Input
   */
  focus: [evt: FocusEvent];
  /**
   * Emit срабатывает при потере фокуса Input
   */
  blur: [evt: FocusEvent];
  /**
   * Emit срабатывает при очистке Input кликом по кнопке очистки
   */
  clear: [];
  /**
   * Emit срабатывает, когда указатель мыши покидает элемент Input
   */
  mouseleave: [evt: MouseEvent];
  /**
   * Emit срабатывает, когда указатель мыши наводится на элемент Input
   */
  mouseenter: [evt: MouseEvent];
  /**
   * Emit срабатывает при нажатии клавиши
   */
  keydown: [evt: KeyboardEvent];
  /**
   * Emit срабатывает при начале композиционного ввода (например, ввод иероглифов)
   */
  compositionstart: [evt: CompositionEvent];
  /**
   * Emit срабатывает при обновлении композиционного ввода
   */
  compositionupdate: [evt: CompositionEvent];
  /**
   * Emit срабатывает при завершении композиционного ввода
   */
  compositionend: [evt: CompositionEvent];
};

export type Exposes = {
  /**
   * HTML input element
   */
  textarea: ShallowRef<HTMLTextAreaElement | undefined>;
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
