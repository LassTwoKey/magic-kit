import { computed, ref, unref } from 'vue';
import { useZIndex } from '@magic/kit/hooks';
import { isNumber } from '@magic/kit/utils';

import type { Props } from '../api';

import type { CSSProperties, Ref, ComputedRef, StyleValue } from 'vue';
import type { Role } from '@magic/kit/components/MkPopper/types';

interface PopperStyles {
  popper?: CSSProperties;
  arrow?: CSSProperties;
}

interface PopperAttributes {
  popper?: Record<string, unknown>;
}

interface UsePopperContentDOMOptions {
  attributes: Ref<PopperAttributes> | ComputedRef<PopperAttributes>;
  styles: Ref<PopperStyles> | ComputedRef<PopperStyles>;
  role: Ref<Role>;
}

export const usePopperContentDOM = (
  props: Props,
  { attributes, styles, role }: UsePopperContentDOMOptions
) => {
  const { nextZIndex } = useZIndex();

  const contentAttrs = computed(() => unref(attributes).popper);
  const contentZIndex = ref<number>(isNumber(props.zIndex) ? props.zIndex : nextZIndex());
  const contentClass = computed(() => [
    'mk-popper-content',
    {
      'mk-popper-content--pure': props.pure,
      [`mk-popper-content--${props.effect}`]: props.effect,
    },
    props.popperClass,
  ]);
  const contentStyle = computed((): StyleValue[] => {
    return [{ zIndex: unref(contentZIndex) }, unref(styles).popper, props.popperStyle];
  });
  const ariaModal = computed<string | undefined>(() =>
    role.value === 'dialog' ? 'false' : undefined
  );
  const arrowStyle = computed<CSSProperties>(() => unref(styles).arrow || {});

  const updateZIndex = () => {
    contentZIndex.value = isNumber(props.zIndex) ? props.zIndex : nextZIndex();
  };

  return {
    ariaModal,
    arrowStyle,
    contentAttrs,
    contentClass,
    contentStyle,
    contentZIndex,
    updateZIndex,
  };
};
