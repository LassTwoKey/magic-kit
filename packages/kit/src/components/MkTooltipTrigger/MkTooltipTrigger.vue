<template>
  <MkPopperTrigger
    :id="id"
    :virtual-ref="virtualRef"
    :open="open"
    :virtual-triggering="virtualTriggering"
    class="mk-tooltip-trigger"
    @blur="onBlur"
    @click="onClick"
    @contextmenu="onContextMenu"
    @focus="onFocus"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
    @keydown="onKeydown"
  >
    <slot />
  </MkPopperTrigger>
</template>

<script setup lang="ts">
import { inject, nextTick, ref, toRef, unref } from 'vue';
import { MkPopperTrigger } from '@magic/kit/components/MkPopperTrigger';
import { TOOLTIP_INJECTION_KEY } from '@magic/kit/constants';
import { EVENT_CODE } from '@magic/kit/constants';
import { composeEventHandlers, focusElement, getEventCode } from '@magic/kit/utils';

import type { Props } from './api';
import { whenTrigger } from './utils';

import type { TooltipContext } from '@magic/kit/components/MkTooltip/types';

defineOptions({
  name: 'MkTooltipTrigger',
});

const props = withDefaults(defineProps<Props>(), {
  trigger: 'hover',
  triggerKeys: () => [EVENT_CODE.enter, EVENT_CODE.numpadEnter, EVENT_CODE.space],
});

const tooltipContext = inject<TooltipContext>(TOOLTIP_INJECTION_KEY);

if (!tooltipContext) {
  throw new Error('MkTooltipTrigger must be used within MkTooltip');
}

const { controlled, id, open, onOpen, onClose, onToggle } = tooltipContext;

const triggerRef = ref(null);

const stopWhenControlledOrDisabled = () => {
  if (unref(controlled) || props.disabled) {
    return true;
  }
};

const trigger = toRef(props, 'trigger');
const onMouseenter = composeEventHandlers(
  stopWhenControlledOrDisabled,
  whenTrigger(trigger, 'hover', (e) => {
    onOpen(e);

    if (props.focusOnTarget && e.target) {
      void nextTick(() => {
        focusElement(e.target, { preventScroll: true });
      });
    }
  })
);

const onMouseleave = composeEventHandlers(
  stopWhenControlledOrDisabled,
  whenTrigger(trigger, 'hover', onClose)
);

const onClick = composeEventHandlers(
  stopWhenControlledOrDisabled,
  whenTrigger(trigger, 'click', (e) => {
    if ((e as MouseEvent).button === 0) {
      onToggle?.(e);
    }
  })
);

const onFocus = composeEventHandlers(
  stopWhenControlledOrDisabled,
  whenTrigger(trigger, 'focus', onOpen)
);

const onBlur = composeEventHandlers(
  stopWhenControlledOrDisabled,
  whenTrigger(trigger, 'focus', onClose)
);

const onContextMenu = composeEventHandlers(
  stopWhenControlledOrDisabled,
  whenTrigger(trigger, 'contextmenu', (e) => {
    e.preventDefault();
    onToggle?.(e);
  })
);

const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e: KeyboardEvent) => {
  const code = getEventCode(e);
  if (code && props.triggerKeys.includes(code)) {
    e.preventDefault();
    onToggle?.(e);
  }
});

defineExpose({
  triggerRef,
});
</script>

<style src="./MkTooltipTrigger.scss"></style>
