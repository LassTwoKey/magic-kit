import type { Ref } from 'vue';
import type { Trigger } from '@magic/kit/components/MkTooltipTrigger/types';

export interface TooltipContext {
  controlled: Ref<boolean>;
  id: Ref<string>;
  open: Ref<boolean>;
  trigger: Ref<Trigger | Trigger[]>;
  onClose: (event?: Event, delay?: number) => void;
  onOpen: (event?: Event, delay?: number) => void;
  onShow: (event?: Event) => void;
  onHide: (event?: Event) => void;
  onBeforeShow?: () => void;
  onBeforeHide?: () => void;
  onToggle?: (event: Event) => void;
  updatePopper?: () => void;
}
