import type { ComputedRef, Ref } from 'vue';
import type { Instance } from '@popperjs/core';

export type Role =
  | 'dialog'
  | 'grid'
  | 'group'
  | 'listbox'
  | 'menu'
  | 'navigation'
  | 'tooltip'
  | 'tree';

export interface PopperContentContext {
  triggerRef: Ref<HTMLElement>;
  popperInstanceRef: Ref<Instance>;
  contentRef: Ref<HTMLElement>;
  referenceRef: Ref<HTMLElement>;
  role: ComputedRef<Role>;
}
