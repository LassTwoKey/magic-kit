import type { Component } from 'vue';
import type { Size } from '@magic/kit/types';

export type InputDropdownStatus = 'progress' | 'good' | 'bad';

export type Props = {
  /**
   * Отображаемое значение
   */
  modelValue?: string;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * Disabled
   */
  disabled?: boolean;
  /**
   * Состояние ошибки
   */
  invalid?: boolean;
  /**
   * Текст ошибки снизу
   */
  error?: string;
  /**
   * Статус: progress, good, bad (полоска слева)
   */
  status?: InputDropdownStatus;
  /**
   * Кружок статуса перед текстом: progress, good, bad
   */
  statusDot?: InputDropdownStatus;
  /**
   * Показать preloader вместо стрелки
   */
  loading?: boolean;
  /**
   * Размер
   */
  size?: Size;
  /**
   * Иконка слева от текста
   */
  prefixIcon?: string | Component;
  /**
   * Текст description по бокам
   */
  description?: string;
};

export type Emits = {
  click: [event: MouseEvent];
};

export type Slots = {
  default?: (props?: any) => any;
  prefixIcon?: (props?: any) => any;
  suffixContent?: (props?: any) => any;
  subButtons?: (props?: any) => any;
};

export type Exposes = {
  focus: () => void;
  blur: () => void;
};
