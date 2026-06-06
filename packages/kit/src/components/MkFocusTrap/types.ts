import type { Ref } from 'vue';

export interface FocusTrapContext {
  focusTrapRef: Ref<HTMLElement | undefined>;
  onKeydown: (e: KeyboardEvent) => void;
}

export type FocusReason = 'pointer' | 'keyboard' | undefined;

export type FocusStart = 'first' | 'last' | 'container';

export interface FocusReasonContext {
  focusReason: Ref<FocusReason>;
  lastUserFocusTimestamp: Ref<number>;
  lastAutomatedFocusTimestamp: Ref<number>;
}

export interface FocusableLayer {
  paused: boolean;
  pause(): void;
  resume(): void;
}

export interface FocusableStack {
  push: (layer: FocusableLayer) => void;
  remove: (layer: FocusableLayer) => void;
}

export interface FocusOutPreventedDetail {
  focusReason: FocusReason;
}
