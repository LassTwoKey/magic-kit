import { createModelToggleComposable } from '@magic/kit/hooks';

import type { Props as MkPopperProps } from '@magic/kit/components/MkPopper/api';
import type { Props as MkTooltipContentProps } from '@magic/kit/components/MkTooltipContent/api';
import type { Props as MkTooltipTriggerProps } from '@magic/kit/components/MkTooltipTrigger/api';

export const {
  useModelToggleProps: useTooltipModelToggleProps,
  useModelToggleEmits: useTooltipModelToggleEmits,
  useModelToggle: useTooltipModelToggle,
} = createModelToggleComposable('visible');

export interface Props extends MkPopperProps, MkTooltipContentProps, MkTooltipTriggerProps {
  /**
   * Показывать стрелку tooltip
   */
  showArrow?: boolean;
}

export type Emits = {
  'update:visible': [val: boolean];
  'before-show': [event?: Event];
  'before-hide': [event?: Event];
  show: [event?: Event];
  hide: [event?: Event];
  open: [];
  close: [];
};
