import { computed, inject, onMounted, ref, unref, watch } from 'vue';
import { POPPER_INJECTION_KEY } from '@magic/kit/constants';
import { usePopper } from '@magic/kit/hooks';

import type { Props } from '../api';
import { buildPopperOptions, unwrapMeasurableEl } from '../utils';

import type { PopperContentContext } from '@magic/kit/components/MkPopper/types';

const DEFAULT_ARROW_OFFSET = 0;

export const usePopperContent = (props: Props) => {
  const { popperInstanceRef, contentRef, triggerRef, role } =
    inject<PopperContentContext>(POPPER_INJECTION_KEY)!;

  const arrowRef = ref<HTMLElement | undefined>();
  const arrowOffset = computed(() => props.arrowOffset);

  const eventListenerModifier = computed(() => {
    return {
      name: 'eventListeners',
      enabled: !!props.visible,
    };
  });

  const arrowModifier = computed(() => {
    const arrowEl = unref(arrowRef);
    const offset = unref(arrowOffset) ?? DEFAULT_ARROW_OFFSET;

    return {
      name: 'arrow',
      enabled: arrowEl !== undefined,
      options: {
        element: arrowEl,
        padding: offset,
      },
    };
  });

  const options = computed(() => {
    return {
      onFirstUpdate: () => {
        void update();
      },
      ...buildPopperOptions(props, [unref(arrowModifier), unref(eventListenerModifier)]),
    };
  });

  const computedReference = computed(
    () => unwrapMeasurableEl(props.referenceEl) || unref(triggerRef)
  );

  const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(
    computedReference,
    contentRef,
    options
  );

  watch(
    instanceRef,
    (instance) => {
      if (instance) popperInstanceRef.value = instance;
    },
    {
      flush: 'sync',
    }
  );

  onMounted(() => {
    watch(
      () => unref(computedReference)?.getBoundingClientRect?.(),
      () => {
        void update();
      }
    );
  });

  return {
    attributes,
    arrowRef,
    contentRef,
    instanceRef,
    state,
    styles,
    role,

    forceUpdate,
    update,
  };
};
