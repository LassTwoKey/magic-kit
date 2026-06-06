<template>
  <MkPopper
    ref="popperRef"
    :role="role"
  >
    <MkTooltipTrigger
      :disabled="disabled"
      :trigger="trigger"
      :trigger-keys="triggerKeys"
      :virtual-ref="virtualRef"
      :virtual-triggering="virtualTriggering"
      :focus-on-target="focusOnTarget"
    >
      <slot v-if="$slots.default" />
    </MkTooltipTrigger>
    <MkTooltipContent
      ref="contentRef"
      :aria-label="ariaLabel"
      :boundaries-padding="boundariesPadding"
      :content="content"
      :disabled="disabled"
      :effect="effect"
      :enterable="enterable"
      :fallback-placements="fallbackPlacements"
      :hide-after="hideAfter"
      :gpu-acceleration="gpuAcceleration"
      :offset="offset"
      :persistent="persistent"
      :popper-class="kls"
      :popper-style="popperStyle"
      :placement="placement"
      :popper-options="popperOptions"
      :arrow-offset="arrowOffset"
      :pure="pure"
      :raw-content="rawContent"
      :reference-el="referenceEl"
      :trigger-target-el="triggerTargetEl"
      :show-after="showAfter"
      :strategy="strategy"
      :teleported="teleported"
      :transition="transition"
      :virtual-triggering="virtualTriggering"
      :z-index="zIndex"
      :append-to="appendTo"
      :loop="loop"
    >
      <slot name="content">
        <span
          v-if="rawContent"
          v-html="content"
        />
        <span v-else>{{ content }}</span>
      </slot>
      <MkPopperArrow v-if="showArrow" />
    </MkTooltipContent>
  </MkPopper>
</template>

<script setup lang="ts">
import { computed, onDeactivated, provide, readonly, ref, toRef, unref, watch } from 'vue';
import { MkPopper } from '@magic/kit/components/MkPopper';
import { MkPopperArrow } from '@magic/kit/components/MkPopperArrow';
import { MkTooltipContent } from '@magic/kit/components/MkTooltipContent';
import { MkTooltipTrigger } from '@magic/kit/components/MkTooltipTrigger';
import { TOOLTIP_INJECTION_KEY } from '@magic/kit/constants';
import { useDelayedToggle, useId, usePopperContainer } from '@magic/kit/hooks';
import { isBoolean } from '@magic/kit/utils';

import { useTooltipModelToggle } from './api';
import type { Props, Emits } from './api';

defineOptions({
  name: 'MkTooltip',
});

const props = withDefaults(defineProps<Props>(), {
  visible: null,
  showArrow: false,
  trigger: 'hover',
  showAfter: 0,
  hideAfter: 200,
  autoClose: 0,
});
const emit = defineEmits<Emits>();

usePopperContainer();

const id = useId();
const popperRef = ref();
const contentRef = ref();

const updatePopper = () => {
  const popperComponent = unref(popperRef);
  if (popperComponent) {
    popperComponent.popperInstanceRef?.update();
  }
};

const open = ref(false);
const toggleReason = ref();

const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
  indicator: open,
  toggleReason,
});

const { onOpen, onClose } = useDelayedToggle({
  showAfter: toRef(props, 'showAfter'),
  hideAfter: toRef(props, 'hideAfter'),
  autoClose: toRef(props, 'autoClose'),
  open: show,
  close: hide,
});

const controlled = computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);

const kls = computed(() => {
  return ['mk-tooltip', props.popperClass];
});

provide(TOOLTIP_INJECTION_KEY, {
  controlled,
  id,
  open: readonly(open),
  trigger: toRef(props, 'trigger'),
  onOpen,
  onClose,
  onToggle: (event: Event) => {
    if (unref(open)) {
      onClose(event);
    } else {
      onOpen(event);
    }
  },
  onShow: () => {
    emit('show', toggleReason.value);
  },
  onHide: () => {
    emit('hide', toggleReason.value);
  },
  onBeforeShow: () => {
    emit('before-show', toggleReason.value);
  },
  onBeforeHide: () => {
    emit('before-hide', toggleReason.value);
  },
  updatePopper,
});

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled && open.value) {
      open.value = false;
    }
  }
);

const isFocusInsideContent = (event: Event) => {
  return contentRef.value?.isFocusInsideContent(event);
};

onDeactivated(() => open.value && hide());

defineExpose({
  popperRef,
  contentRef,
  isFocusInsideContent,
  updatePopper,
  onOpen,
  onClose,
  hide,
});
</script>

<style src="./MkTooltip.scss"></style>
