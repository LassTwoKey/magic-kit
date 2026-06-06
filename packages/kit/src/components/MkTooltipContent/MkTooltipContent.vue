<template>
  <MkPortal
    :to="appendTo"
    :disabled="!teleported"
  >
    <Transition
      v-if="shouldRender || !ariaHidden"
      :name="transitionClass"
      :appear="!persistentRef"
      @after-leave="onTransitionLeave"
      @before-enter="onBeforeEnter"
      @after-enter="onAfterShow"
      @before-leave="onBeforeLeave"
    >
      <MkPopperContent
        v-show="shouldShow"
        :id="id"
        ref="contentRef"
        v-bind="$attrs"
        :aria-label="ariaLabel"
        :aria-hidden="ariaHidden"
        :boundaries-padding="boundariesPadding"
        :fallback-placements="fallbackPlacements"
        :gpu-acceleration="gpuAcceleration"
        :offset="offset"
        :placement="placement"
        :popper-options="popperOptions"
        :arrow-offset="arrowOffset"
        :strategy="strategy"
        :effect="effect"
        :enterable="enterable"
        :pure="pure"
        :popper-class="popperClass"
        :popper-style="[popperStyle, contentStyle]"
        :reference-el="referenceEl"
        :trigger-target-el="triggerTargetEl"
        :visible="shouldShow"
        :z-index="zIndex"
        :loop="loop"
        @mouseenter="onContentEnter"
        @mouseleave="onContentLeave"
        @blur="onBlur"
        @close="onClose"
      >
        <slot />
      </MkPopperContent>
    </Transition>
  </MkPortal>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, unref, watch } from 'vue';
import { MkPopperContent } from '@magic/kit/components/MkPopperContent';
import { MkPortal } from '@magic/kit/components/MkPortal';
import { TOOLTIP_INJECTION_KEY } from '@magic/kit/constants';
import { usePopperContainerId } from '@magic/kit/hooks';
import { ensureArray, composeEventHandlers, focusElement } from '@magic/kit/utils';
import { onClickOutside } from '@vueuse/core';

import { isTriggerType } from '../MkTooltipTrigger/utils';
import type { Props } from './api';

import type { TooltipContext } from '@magic/kit/components/MkTooltip/types';
import type { Fn } from '@vueuse/core';

defineOptions({
  name: 'MkTooltipContent',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  content: '',
  appendTo: null,
  teleported: true,
  visible: null,
  enterable: true,
});

const { selector } = usePopperContainerId();

const contentRef = ref();
const popperContentRef = computed(() => contentRef.value?.popperContentRef);
let stopHandle: Fn | undefined;

const tooltipContext = inject<TooltipContext>(TOOLTIP_INJECTION_KEY);

if (!tooltipContext) {
  throw new Error('MkTooltipContent must be used within MkTooltip');
}

const {
  controlled,
  id,
  open,
  trigger,
  onClose,
  onOpen,
  onShow,
  onHide,
  onBeforeShow,
  onBeforeHide,
} = tooltipContext;

const transitionClass = computed(() => {
  return props.transition || `mk-tootip-fade-in-linear`;
});

const persistentRef = computed(() => {
  if (typeof process !== 'undefined') {
    if (import.meta.env.NODE_ENV === 'test' && !import.meta.env.RUN_TEST_WITH_PERSISTENT) {
      return true;
    }
  }
  return props.persistent;
});

onBeforeUnmount(() => {
  stopHandle?.();
});

const shouldRender = computed(() => {
  return unref(persistentRef) ? true : unref(open);
});

const shouldShow = computed(() => {
  return props.disabled ? false : unref(open);
});

const appendTo = computed(() => {
  return props.appendTo || selector.value;
});

const contentStyle = computed(() => props.style ?? {});

const ariaHidden = ref(true);

const onTransitionLeave = () => {
  onHide();
  if (isFocusInsideContent()) focusElement(document.body, { preventScroll: true });
  ariaHidden.value = true;
};

const stopWhenControlled = () => {
  if (unref(controlled)) return true;
};

const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
  if (props.enterable && isTriggerType(unref(trigger), 'hover')) {
    onOpen();
  }
});

const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
  if (isTriggerType(unref(trigger), 'hover')) {
    onClose();
  }
});

const onBeforeEnter = () => {
  contentRef.value?.updatePopper?.();
  onBeforeShow?.();
};

const onBeforeLeave = () => {
  onBeforeHide?.();
};

const onAfterShow = () => {
  onShow();
};

const onBlur = () => {
  if (!props.virtualTriggering) {
    onClose();
  }
};

const isFocusInsideContent = (event?: FocusEvent) => {
  const popperContent = contentRef.value?.popperContentRef;
  const activeElement = event?.relatedTarget || document.activeElement;

  return popperContent?.contains(activeElement);
};

watch(
  () => unref(open),
  (val) => {
    if (!val) {
      stopHandle?.();
    } else {
      ariaHidden.value = false;
      stopHandle = onClickOutside(
        popperContentRef,
        () => {
          if (unref(controlled)) return;
          const needClose = ensureArray(unref(trigger)).every((item) => {
            return item !== 'hover' && item !== 'focus';
          });
          if (needClose) {
            onClose();
          }
        },
        { detectIframe: true }
      );
    }
  },
  {
    flush: 'post',
  }
);

watch(
  () => props.content,
  () => {
    contentRef.value?.updatePopper?.();
  }
);

defineExpose({
  contentRef,
  isFocusInsideContent,
});
</script>
