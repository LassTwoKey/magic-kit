import type { SwitchOption, SwitchPropsMap } from './types';

import type { ModelValue } from '@magic/kit/components/MkSwitch/types';

export type Props = {
  /**
   * Привязка значения
   */
  modelValue?: ModelValue[];
  /**
   * Заблокировать вложенные свитчи
   */
  disabled?: boolean;
  /**
   * Данные для вывода внутри группы
   */
  options?: SwitchOption[];
  /**
   * Настройка алиасов для options
   */
  props?: Partial<SwitchPropsMap>;
  /**
   * Минимальное кол-во свитчей для выбора
   */
  min?: number;
  /**
   * Максимальное кол-во свитчей для выбора
   */
  max?: number;
};

export type Emits = {
  /**
   * Emit для значения
   */
  'update:modelValue': [val: ModelValue[]];
  /**
   * Emit для значения
   */
  change: [val: ModelValue[]];
};
