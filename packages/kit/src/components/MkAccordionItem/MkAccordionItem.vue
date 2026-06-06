<template>
  <div
    :class="[
      'mk-accordion-item',
      {
        'mk-accordion-item--expanded': isOpen,
        'mk-accordion-item--disabled': disabled,
      },
    ]"
  >
    <div
      :id="headerId"
      :class="['mk-accordion-item__header px-6', props.headerClasses]"
      :style="props.headerStyles"
      role="button"
      :aria-expanded="isOpen"
      :aria-disabled="disabled || undefined"
      :aria-controls="contentId"
      tabindex="0"
      @click="onToggle"
      @keydown.enter="onToggle"
      @keydown.space.prevent="onToggle"
    >
      <slot
        name="header"
        :is-open="isOpen"
        :disabled="disabled"
      >
        <span class="mk-accordion-item__title">
          <template v-if="typeof title === 'string'">{{ title }}</template>
          <component
            :is="title"
            v-else-if="title"
          />
        </span>
      </slot>

      <span class="mk-accordion-item__icon">
        <slot
          name="icon"
          :is-open="isOpen"
        >
          <MkKeyboardArrowDownIcon class="mk-accordion-item__chevron" />
        </slot>
      </span>
    </div>

    <div
      :id="contentId"
      :aria-labelledby="headerId"
      role="region"
      class="mk-accordion-item__content-wrapper"
    >
      <div class="mk-accordion-item__content">
        <div class="pb-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { accordionKey } from '@magic/kit/constants';
import { useId } from '@magic/kit/hooks';
import { MkKeyboardArrowDownIcon } from '@magic/kit/icons';

import type { AccordionContext } from '../MkAccordion/types';
import type { Emits, Props } from './api';

defineOptions({
  name: 'MkAccordionItem',
});

const props = withDefaults(defineProps<Props>(), {
  title: '',
  defaultOpen: false,
  disabled: false,
});
const emit = defineEmits<Emits>();

const accordion = inject<AccordionContext | undefined>(accordionKey, undefined);
const id = useId();
const headerId = computed(() => `mk-accordion-header-${id.value}`);
const contentId = computed(() => `mk-accordion-content-${id.value}`);

// Если нет родительского аккордеона, управляем состоянием локально.
const localOpen = ref(props.defaultOpen);

const isOpen = computed(() => {
  if (accordion) {
    return accordion.openItems.value.has(props.name);
  }
  return localOpen.value;
});

function onToggle() {
  if (props.disabled) return;

  if (accordion) {
    accordion.toggleItem(props.name);
  } else {
    localOpen.value = !localOpen.value;
  }

  if (isOpen.value) {
    emit('open', props.name);
  } else {
    emit('close', props.name);
  }
}

// Регистрируем defaultOpen при монтировании, если есть родитель.
onMounted(() => {
  if (accordion && props.defaultOpen && !accordion.openItems.value.has(props.name)) {
    accordion.toggleItem(props.name);
  }
});
</script>

<style src="./MkAccordionItem.scss"></style>
