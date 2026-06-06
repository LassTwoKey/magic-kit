import { ref } from 'vue';

import type { Props, Emits } from '../api';

import type { SetupContext } from 'vue';

interface FocusAfterReleasedEvent extends CustomEvent {
  detail: {
    focusReason?: 'pointer' | 'keyboard' | 'programmatic';
  };
}

interface FocusoutPreventedEvent extends CustomEvent {
  detail: {
    focusReason: 'pointer' | 'keyboard' | 'programmatic';
  };
}

export const usePopperContentFocusTrap = (props: Props, emit: SetupContext<Emits>['emit']) => {
  const trapped = ref<boolean>(false);
  const focusStartRef = ref<HTMLElement | 'first' | 'last' | undefined>();

  const onFocusAfterTrapped = () => {
    emit('focus');
  };

  const onFocusAfterReleased = (event: FocusAfterReleasedEvent) => {
    if (event.detail?.focusReason !== 'pointer') {
      focusStartRef.value = 'first';
      emit('blur');
    }
  };

  const onFocusInTrap = (event: FocusEvent) => {
    if (props.visible && !trapped.value) {
      if (event.target) {
        focusStartRef.value = event.target as HTMLElement;
      }
      trapped.value = true;
    }
  };

  const onFocusoutPrevented = (event: FocusoutPreventedEvent) => {
    if (!props.trapping) {
      if (event.detail.focusReason === 'pointer') {
        event.preventDefault();
      }
      trapped.value = false;
    }
  };

  const onReleaseRequested = () => {
    trapped.value = false;
    emit('close');
  };

  return {
    focusStartRef,
    trapped,

    onFocusAfterReleased,
    onFocusAfterTrapped,
    onFocusInTrap,
    onFocusoutPrevented,
    onReleaseRequested,
  };
};
