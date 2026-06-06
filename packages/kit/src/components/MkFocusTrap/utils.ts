import { onBeforeUnmount, onMounted, ref } from 'vue';
import { focusElement } from '@magic/kit/utils';

import { FOCUSOUT_PREVENTED, FOCUSOUT_PREVENTED_OPTS } from './tokens';
import type {
  FocusReason,
  FocusReasonContext,
  FocusableLayer,
  FocusableStack,
  FocusOutPreventedDetail,
} from './types';

const focusReason = ref<FocusReason>();
const lastUserFocusTimestamp = ref<number>(0);
const lastAutomatedFocusTimestamp = ref<number>(0);
let focusReasonUserCount = 0;

export const obtainAllFocusableElements = (element: HTMLElement): HTMLElement[] => {
  const nodes: HTMLElement[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: Node) => {
      const el = node as HTMLElement;
      const isHiddenInput = el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'hidden';
      if ((el as HTMLButtonElement).disabled || el.hidden || isHiddenInput)
        return NodeFilter.FILTER_SKIP;
      return el.tabIndex >= 0 || el === document.activeElement
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);

  return nodes;
};

export const getVisibleElement = (
  elements: HTMLElement[],
  container: HTMLElement
): HTMLElement | undefined => {
  for (const element of elements) {
    if (!isHidden(element, container)) return element;
  }
};

export const isHidden = (element: HTMLElement | null, container: HTMLElement): boolean => {
  if (typeof import.meta.env !== 'undefined' && import.meta.env.NODE_ENV === 'test') return false;
  if (!element) return false;
  if (getComputedStyle(element).visibility === 'hidden') return true;

  let current: HTMLElement | null = element;
  while (current) {
    if (container && current === container) return false;
    if (getComputedStyle(current).display === 'none') return true;
    current = current.parentElement;
  }

  return false;
};

export const getEdges = (
  container: HTMLElement
): [HTMLElement | undefined, HTMLElement | undefined] => {
  const focusable = obtainAllFocusableElements(container);
  const first = getVisibleElement(focusable, container);
  const last = getVisibleElement([...focusable].reverse(), container);
  return [first, last];
};

const isSelectable = (element: HTMLElement): element is HTMLInputElement => {
  return element instanceof HTMLInputElement && 'select' in element;
};

export const tryFocus = (element: HTMLElement | undefined, shouldSelect?: boolean): void => {
  if (element) {
    const prevFocusedElement = document.activeElement;

    focusElement(element, { preventScroll: true });
    lastAutomatedFocusTimestamp.value = window.performance.now();

    if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
      element.select();
    }
  }
};

function removeFromStack<T>(list: T[], item: T): T[] {
  const copy = [...list];
  const idx = list.indexOf(item);
  if (idx !== -1) {
    copy.splice(idx, 1);
  }
  return copy;
}

const createFocusableStack = (): FocusableStack => {
  let stack: FocusableLayer[] = [];

  const push = (layer: FocusableLayer): void => {
    const currentLayer = stack[0];

    if (currentLayer && layer !== currentLayer) {
      currentLayer.pause?.();
    }

    stack = removeFromStack(stack, layer);
    stack.unshift(layer);
  };

  const remove = (layer: FocusableLayer): void => {
    stack = removeFromStack(stack, layer);
    stack[0]?.resume?.();
  };

  return { push, remove };
};

export const focusFirstDescendant = (elements: HTMLElement[], shouldSelect = false): void => {
  const prevFocusedElement = document.activeElement;
  for (const element of elements) {
    tryFocus(element, shouldSelect);
    if (document.activeElement !== prevFocusedElement) return;
  }
};

export const focusableStack: FocusableStack = createFocusableStack();

export const isFocusCausedByUserEvent = (): boolean => {
  return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
};

const notifyFocusReasonPointer = (): void => {
  focusReason.value = 'pointer';
  lastUserFocusTimestamp.value = window.performance.now();
};

const notifyFocusReasonKeydown = (): void => {
  focusReason.value = 'keyboard';
  lastUserFocusTimestamp.value = window.performance.now();
};

export const useFocusReason = (): FocusReasonContext => {
  onMounted(() => {
    if (focusReasonUserCount === 0) {
      document.addEventListener('mousedown', notifyFocusReasonPointer);
      document.addEventListener('touchstart', notifyFocusReasonPointer);
      document.addEventListener('keydown', notifyFocusReasonKeydown);
    }
    focusReasonUserCount++;
  });

  onBeforeUnmount(() => {
    focusReasonUserCount--;
    if (focusReasonUserCount <= 0) {
      document.removeEventListener('mousedown', notifyFocusReasonPointer);
      document.removeEventListener('touchstart', notifyFocusReasonPointer);
      document.removeEventListener('keydown', notifyFocusReasonKeydown);
    }
  });

  return {
    focusReason,
    lastUserFocusTimestamp,
    lastAutomatedFocusTimestamp,
  };
};

export const createFocusOutPreventedEvent = (
  detail: FocusOutPreventedDetail
): CustomEvent<FocusOutPreventedDetail> => {
  return new CustomEvent<FocusOutPreventedDetail>(FOCUSOUT_PREVENTED, {
    ...FOCUSOUT_PREVENTED_OPTS,
    detail,
  });
};
