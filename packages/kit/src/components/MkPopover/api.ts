import { createModelToggleComposable } from '@magic/kit/hooks';

import type { Props as MkPopperProps } from '@magic/kit/components/MkPopper/api';
import type { Props as MkTooltipContentProps } from '@magic/kit/components/MkTooltipContent/api';
import type { Props as MkTooltipTriggerProps } from '@magic/kit/components/MkTooltipTrigger/api';
import type { Placement } from '@popperjs/core';

export const {
  useModelToggleProps: usePopoverModelToggleProps,
  useModelToggleEmits: usePopoverModelToggleEmits,
  useModelToggle: usePopoverModelToggle,
} = createModelToggleComposable('visible');

export interface Props
  extends MkPopperProps,
    Omit<MkTooltipContentProps, 'visible'>,
    MkTooltipTriggerProps {
  /**
   * Видимость popover. Используется для v-model:visible.
   */
  visible?: boolean | null;
  /**
   * Позиция popover.
   */
  placement?: Placement;
  /**
   * Показывать стрелку.
   */
  showArrow?: boolean;
  /**
   * Ширина popover.
   */
  width?: string | number;
}

export type Emits = {
  /**
   * Emit Привязка видимости. Используется для v-model:visible.
   */
  'update:visible': [val: boolean];
  /**
   * Emit Срабатывает перед показом.
   */
  'before-show': [event?: Event];
  /**
   * Emit Срабатывает перед скрытием.
   */
  'before-hide': [event?: Event];
  /**
   * Emit Срабатывает при показе.
   */
  show: [event?: Event];
  /**
   * Emit Срабатывает при скрытии.
   */
  hide: [event?: Event];
};
