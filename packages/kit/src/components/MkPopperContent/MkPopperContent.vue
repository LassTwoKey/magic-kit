<template>
  <div
    ref="contentRef"
    v-bind="contentAttrs"
    :style="contentStyle"
    :class="contentClass"
    tabindex="-1"
    @mouseenter="(e) => $emit('mouseenter', e)"
    @mouseleave="(e) => $emit('mouseleave', e)"
  >
    <MkFocusTrap
      :loop="loop"
      :trapped="trapped"
      :trap-on-focus-in="true"
      :focus-trap-el="contentRef"
      :focus-start-el="focusStartRef"
      @focus-after-trapped="onFocusAfterTrapped"
      @focus-after-released="onFocusAfterReleased"
      @focusin="onFocusInTrap"
      @focusout-prevented="onFocusoutPrevented"
      @release-requested="onReleaseRequested"
    >
      <slot />
    </MkFocusTrap>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, unref, watch } from 'vue';
import { MkFocusTrap } from '@magic/kit/components/MkFocusTrap';
import { POPPER_CONTENT_INJECTION_KEY } from '@magic/kit/constants';
import { isElement } from '@magic/kit/utils';
import { isNil } from 'lodash-es';

import type { Emits, Props, Exposes } from './api';
import { usePopperContent, usePopperContentDOM, usePopperContentFocusTrap } from './composables';

import type { WatchStopHandle } from 'vue';

defineOptions({
  name: 'MkPopperContent',
});

const emit = defineEmits<Emits>();

const props = withDefaults(defineProps<Props>(), {
  role: 'tooltip',
});

const {
  focusStartRef,
  trapped,
  onFocusAfterReleased,
  onFocusAfterTrapped,
  onFocusInTrap,
  onFocusoutPrevented,
  onReleaseRequested,
} = usePopperContentFocusTrap(props, emit);

const {
  attributes,
  arrowRef,
  contentRef,
  styles,
  instanceRef,
  role = ref('tooltip'),
  update,
} = usePopperContent(props);

const { ariaModal, arrowStyle, contentAttrs, contentClass, contentStyle, updateZIndex } =
  usePopperContentDOM(props, {
    styles,
    attributes,
    role,
  });

provide(POPPER_CONTENT_INJECTION_KEY, {
  arrowStyle,
  arrowRef,
});

let triggerTargetAriaStopWatch: WatchStopHandle | null = null;

const updatePopper = (shouldUpdateZIndex = true) => {
  update();
  if (shouldUpdateZIndex) updateZIndex();
};

const togglePopperAlive = () => {
  updatePopper(false);
  if (props.visible && props.focusOnShow) {
    trapped.value = true;
  } else if (props.visible === false) {
    trapped.value = false;
  }
};

onMounted(() => {
  watch(
    () => props.triggerTargetEl,
    (triggerTargetEl, prevTriggerTargetEl) => {
      if (triggerTargetAriaStopWatch) {
        triggerTargetAriaStopWatch();
        triggerTargetAriaStopWatch = null;
      }

      const el = unref(triggerTargetEl || contentRef?.value);
      const prevEl = unref(prevTriggerTargetEl || contentRef?.value);

      if (isElement(el)) {
        triggerTargetAriaStopWatch = watch(
          [role, () => props.ariaLabel, ariaModal, () => props.id],
          (watches) => {
            ['role', 'aria-label', 'aria-modal', 'id'].forEach((key, idx) => {
              const value = watches[idx];
              if (isNil(value)) {
                el.removeAttribute(key);
              } else {
                el.setAttribute(key, value.toString());
              }
            });
          },
          { immediate: true }
        );
      }
      if (prevEl !== el && isElement(prevEl)) {
        ['role', 'aria-label', 'aria-modal', 'id'].forEach((key) => {
          prevEl.removeAttribute(key);
        });
      }
    },
    { immediate: true }
  );

  watch(() => props.visible, togglePopperAlive, { immediate: true });
});

onBeforeUnmount(() => {
  if (triggerTargetAriaStopWatch) {
    triggerTargetAriaStopWatch();
    triggerTargetAriaStopWatch = null;
  }
});

defineExpose<Exposes>({
  popperContentRef: contentRef,
  popperInstanceRef: instanceRef,
  updatePopper,
  contentStyle,
});
</script>

<style src="./MkPopperContent.scss"></style>
