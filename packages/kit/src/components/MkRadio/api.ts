import type { ModelValue } from './types';

export type Props = {
  /**
   * Привязка значения
   */
  modelValue?: ModelValue;
  /**
   * Заблокировать
   */
  disabled?: boolean;
  /**
   * Текст
   */
  label?: string;
  /**
   * 	Описание
   */
  description?: string;
  /**
   * 	Всплывающая подсказка
   */
  tooltip?: string;
  /**
   * Value
   */
  value?: ModelValue;
  /**
   * Нативный атрибут name
   */
  name?: string;
};

export type Emits = {
  /**
   * Emit для значения
   */
  'update:modelValue': [val: ModelValue];
  /**
   * Emit для значения
   */
  change: [val: ModelValue];
};
