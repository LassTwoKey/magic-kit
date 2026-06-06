<template>
  <MkPopper
    ref="popperRef"
    role="dialog"
  >
    <MkTooltipTrigger
      :disabled="disabled"
      :trigger="trigger"
      :trigger-keys="triggerKeys"
    >
      <slot />
    </MkTooltipTrigger>
    <MkTooltipContent
      ref="contentRef"
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
      :persistent="persistent"
      :popper-class="kls"
      :popper-style="popoverStyle"
      :show-after="showAfter"
      :hide-after="hideAfter"
      :auto-close="autoClose"
      :teleported="teleported"
      :transition="transition"
      :z-index="zIndex"
      :append-to="appendTo"
    >
      <slot name="content" />
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

import { usePopoverModelToggle } from './api';
import type { Props, Emits } from './api';

defineOptions({
  name: 'MkPopover',
});

const props = withDefaults(defineProps<Props>(), {
  visible: null,
  showArrow: false,
  trigger: 'click',
  showAfter: 0,
  hideAfter: 200,
  autoClose: 0,
  effect: 'light',
  placement: 'bottom',
  width: undefined,
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

const { show, hide, hasUpdateHandler } = usePopoverModelToggle({
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
  return ['mk-popover', props.popperClass];
});

const popoverStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.width) {
    const width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    style.width = width;
  }
  return [props.popperStyle, style];
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

onDeactivated(() => open.value && hide());

defineExpose({
  popperRef,
  contentRef,
  updatePopper,
  onOpen,
  onClose,
  hide,
});
</script>

<style src="./MkPopover.scss"></style>
