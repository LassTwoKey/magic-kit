import type { CheckboxOption, CheckboxPropsMap } from './types';

import type { ModelValue } from '@magic/kit/components/MkCheckbox/types';
import type { Size } from '@magic/kit/types';

export type Props = {
  /**
   * Привязка значения
   */
  modelValue?: ModelValue[];
  /**
   * Заблокировать вложенные чекбоксы
   */
  disabled?: boolean;
  /**
   * Размер чекбоксов
   */
  size?: Size;
  /**
   * Список чекбоксов для вывода внутри группы
   */
  options?: CheckboxOption[];
  /**
   * Настройка алиасов полей для options
   */
  props?: Partial<CheckboxPropsMap>;
  /**
   * Минимальное кол-во чекбоксов для выбора
   */
  min?: number;
  /**
   * Максимальное кол-во чекбоксов для выбора
   */
  max?: number;
};

export type Slots = {
  /**
   * Slot вложенного контента
   */
  default: any;
};

export type Emits = {
  /**
   * Emit для обновления привязанного значения
   */
  'update:modelValue': [val: ModelValue[]];
  /**
   * Emit при изменении выбора
   */
  change: [val: ModelValue[]];
};
