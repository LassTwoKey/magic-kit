import type { ModelValue } from './types';

import type { Size } from '@magic/kit/types';

export type Props = {
  /**
   * Включает indeterminate вид
   */
  indeterminate?: boolean;
  /**
   * Размер
   */
  size?: Size;
  /**
   * Input tabindex
   */
  tabindex?: number;
  /**
   * Привязанное значение
   */
  modelValue?: ModelValue;
  /**
   * Текст рядом с Checkbox
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
  value?: ModelValue;
  /**
   * Заблокировать взаимодействие с чекбоксом
   */
  disabled?: boolean;
  /**
   * Устанавливает выбран ли чекбокс
   */
  checked?: boolean;
  /**
   * Нативный атрибут 'name'
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
