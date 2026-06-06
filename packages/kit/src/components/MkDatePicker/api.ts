import type { PickerOptions } from './types';

import type { Component } from 'vue';

export type Props = {
  /**
   * Привязка значения. В режиме range — массив из двух дат.
   */
  modelValue?: Date | Date[];
  /**
   * Формат отображения в поле ввода.
   */
  format?: string;
  /**
   * Блокирует взаимодействие.
   */
  disabled?: boolean;
  /**
   * Включает режим диапазона.
   */
  range?: boolean;
  /**
   * Иконка перед полем.
   */
  prefixIcon?: string | Component;
  /**
   * Иконка после поля.
   */
  suffixIcon?: string | Component;
  /**
   * Placeholder.
   */
  placeholder?: string;
  /**
   * Состояние ошибки.
   */
  invalid?: boolean;
  /**
   * Сообщение об ошибке.
   */
  errorMessage?: string;
  /**
   * Опции пикера.
   */
  pickerOptions?: PickerOptions;
};

export type Emits = {
  /**
   * Emit Срабатывает при изменении значения. Используется для v-model.
   */
  'update:modelValue': [val: Date | Date[] | null];
  /**
   * Emit Срабатывает при подтверждении выбора пользователем.
   */
  change: [val: Date | Date[] | null];
};

export type Slots = {
  /**
   * Кастомный триггер.
   */
  trigger?: (props: { disabled: boolean; invalid: boolean }) => any;
  /**
   * Иконка перед полем.
   */
  prefixIcon?: (props?: any) => any;
  /**
   * Иконка после поля.
   */
  suffixIcon?: (props?: any) => any;
};
