import type { Trigger } from './types';

import type { Props as MkPopperTriggerProps } from '@magic/kit/components/MkPopperTrigger/api';
import type { EventCode } from '@magic/kit/constants';

export interface Props extends MkPopperTriggerProps {
  /**
   * Отключить tooltip
   */
  disabled?: boolean;
  /**
   * Событие для показа tooltip
   */
  trigger?: Trigger;
  /**
   * Клавиши для срабатывания
   */
  triggerKeys?: EventCode[];
  /**
   * Фокус на целевом элементе
   */
  focusOnTarget?: boolean;
}
