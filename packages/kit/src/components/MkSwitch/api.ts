import type { ModelValue } from './types';

export type Props = {
  /**
   * Привязанное значение
   */
  modelValue?: ModelValue;
  /**
   * Текст рядом со Switch
   */
  label?: string;
  /**
   * Описание
   */
  description?: string;
  /**
   * Всплывающая подсказка
   */
  tooltip?: string;
  /**
   * Value
   */
  value?: ModelValue | object;
  /**
   * Заблокировать взаимодействие со свитчем
   */
  disabled?: boolean;
  /**
   * Устанавливает выбран ли свитч
   */
  checked?: boolean;
  /**
   * Нативный атрибут name
   */
  name?: string;
  /**
   * Значение если выбран
   */
  trueValue?: string | number;
  /**
   * Значение если не выбран
   */
  falseValue?: string | number;
  /**
   * Input id
   */
  id?: string;
  /**
   * Input tabindex
   */
  tabindex?: number;
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
