import type { RadioOption, RadioPropsMap } from './types';

import type { ModelValue } from '@magic/kit/components/MkRadio/types';

export const defaultProps: RadioPropsMap = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
};

export type Props = {
  /**
   * ID
   */
  id?: string;
  /**
   * Привязка значения
   */
  modelValue?: ModelValue;
  /**
   * Заблокировать вложенные radio
   */
  disabled?: boolean;
  /**
   * Нативный атрибут name
   */
  name?: string;
  /**
   * Данные для вывода внутри группы
   */
  options?: RadioOption[];
  /**
   * Настройка алиасов для options
   */
  props?: Record<string, any>;
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
