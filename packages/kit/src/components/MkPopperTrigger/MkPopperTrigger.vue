<template>
  <MkProxySlot
    v-if="!virtualTriggering"
    v-bind="$attrs"
    :aria-controls="ariaControls"
    :aria-describedby="ariaDescribedby"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
  >
    <slot />
  </MkProxySlot>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { MkProxySlot } from '@magic/kit/components/MkProxySlot';
import { POPPER_INJECTION_KEY } from '@magic/kit/constants';
import { useForwardRef } from '@magic/kit/hooks';
import { isElement, isFocusable } from '@magic/kit/utils';
import { unrefElement } from '@vueuse/core';
import { isNil } from 'lodash-es';

import type { Props } from './api';

import type { WatchStopHandle } from 'vue';
import type { Role } from '@magic/kit/components/MkPopper/types';

defineOptions({
  name: 'MkPopperTrigger',
  inheritAttrs: false,
});

const props = defineProps<Props>();

const { role, triggerRef } = inject(POPPER_INJECTION_KEY, {
  role: ref<Role>('tooltip'),
  triggerRef: ref<HTMLElement | SVGElement | null | undefined>(),
});

useForwardRef(triggerRef ?? ref());

const ariaControls = computed(() => {
  return ariaHaspopup.value ? props.id : undefined;
});

const ariaDescribedby = computed(() => {
  if (role && role.value === 'tooltip') {
    return props.open && props.id ? props.id : undefined;
  }
  return undefined;
});

const ariaHaspopup = computed(() => {
  if (role && role.value !== 'tooltip') {
    return role.value;
  }
  return undefined;
});

const ariaExpanded = computed(() => {
  return ariaHaspopup.value ? `${props.open}` : undefined;
});

let virtualTriggerAriaStopWatch: WatchStopHandle | undefined = undefined;

const TRIGGER_ELE_EVENTS = [
  'onMouseenter',
  'onMouseleave',
  'onClick',
  'onKeydown',
  'onFocus',
  'onBlur',
  'onContextmenu',
] as const;

onMounted(() => {
  watch(
    () => props.virtualRef,
    (virtualEl) => {
      if (virtualEl && triggerRef) {
        triggerRef.value = unrefElement(virtualEl);
      }
    },
    {
      immediate: true,
    }
  );

  const htmlTriggerRef = triggerRef as unknown as HTMLElement;

  watch(
    htmlTriggerRef,
    (el?: HTMLElement, prevEl?: HTMLElement) => {
      if (virtualTriggerAriaStopWatch) {
        virtualTriggerAriaStopWatch();
        virtualTriggerAriaStopWatch = undefined;
      }

      if (isElement(prevEl)) {
        TRIGGER_ELE_EVENTS.forEach((eventName) => {
          const handler = props[eventName] as EventListener;
          if (handler) {
            prevEl.removeEventListener(
              eventName.slice(2).toLowerCase(),
              handler,
              ['onFocus', 'onBlur'].includes(eventName)
            );
          }
        });
      }
      if (isElement(el)) {
        TRIGGER_ELE_EVENTS.forEach((eventName) => {
          const handler = props[eventName] as EventListener;
          if (handler) {
            el.addEventListener(
              eventName.slice(2).toLowerCase(),
              handler,
              ['onFocus', 'onBlur'].includes(eventName)
            );
          }
        });
        if (isFocusable(el)) {
          virtualTriggerAriaStopWatch = watch(
            [ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded],
            (watches) => {
              ['aria-controls', 'aria-describedby', 'aria-haspopup', 'aria-expanded'].forEach(
                (key, idx) => {
                  if (isNil(watches[idx])) {
                    el.removeAttribute(key);
                  } else {
                    el.setAttribute(key, watches[idx]);
                  }
                }
              );
            },
            { immediate: true }
          );
        }
      }
      if (isElement(prevEl) && isFocusable(prevEl)) {
        ['aria-controls', 'aria-describedby', 'aria-haspopup', 'aria-expanded'].forEach((key) =>
          prevEl.removeAttribute(key)
        );
      }
    },
    {
      immediate: true,
    }
  );
});

onBeforeUnmount(() => {
  if (virtualTriggerAriaStopWatch) {
    virtualTriggerAriaStopWatch();
    virtualTriggerAriaStopWatch = undefined;
  }
  if (triggerRef?.value && isElement(triggerRef.value)) {
    const el = triggerRef.value;
    TRIGGER_ELE_EVENTS.forEach((eventName) => {
      const handler = props[eventName] as EventListener;
      if (handler) {
        el.removeEventListener(
          eventName.slice(2).toLowerCase(),
          handler,
          ['onFocus', 'onBlur'].includes(eventName)
        );
      }
    });
    triggerRef.value = null;
  }
});

defineExpose({
  /**
   * @description trigger element
   */
  triggerRef,
});
</script>

<style src="./MkPopperTrigger.scss"></style>
