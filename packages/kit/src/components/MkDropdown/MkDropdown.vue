<template>
  <div
    ref="rootRef"
    :class="rootClass"
  >
    <MkPopover
      v-model:visible="open"
      :disabled="props.disabled"
      trigger="click"
      :placement="props.placement"
      :teleported="props.teleported"
      :width="panelWidth"
      :popper-class="'mk-dropdown__popper'"
      :show-after="0"
      :hide-after="0"
    >
      <!-- Триггер — MkInputDropdown -->
      <MkInputDropdown
        :model-value="displayLabel"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :invalid="props.invalid"
        :error="props.error"
        :size="props.size"
        :loading="props.loading"
        :prefix-icon="props.prefixIcon"
        :status="props.status"
        :status-dot="props.statusDot"
        :description="props.description"
      >
        <template
          v-if="$slots.prefixIcon"
          #prefixIcon
        >
          <slot name="prefixIcon" />
        </template>
        <template
          v-if="$slots.suffixContent"
          #suffixContent
        >
          <slot name="suffixContent" />
        </template>
        <template
          v-if="$slots.subButtons"
          #subButtons
        >
          <slot name="subButtons" />
        </template>
      </MkInputDropdown>

      <!-- Панель с пунктами -->
      <template #content>
        <div
          class="mk-dropdown__panel"
          role="listbox"
        >
          <!-- Кастомный контент (заменяет items) -->
          <slot v-if="$slots.default" />

          <!-- Рендер items -->
          <template v-else>
            <MkDropdownItem
              v-for="(item, index) in props.items"
              :key="item.value"
              :label="item.label"
              :icon="item.icon"
              :active="item.value === props.modelValue"
              :disabled="item.disabled"
              @click="handleSelect(item)"
            >
              <template
                v-if="$slots.item"
                #default
              >
                <slot
                  name="item"
                  :item="item"
                  :index="index"
                />
              </template>
            </MkDropdownItem>
          </template>
        </div>
      </template>
    </MkPopover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { MkDropdownItem } from '@magic/kit/components/MkDropdownItem';
import { MkInputDropdown } from '@magic/kit/components/MkInputDropdown';
import { MkPopover } from '@magic/kit/components/MkPopover';

import type { DropdownItem, Emits, Props } from './api';

defineOptions({
  name: 'MkDropdown',
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  placement: 'bottom-start',
  teleported: true,
});

const emit = defineEmits<Emits>();

const open = ref(false);
const rootRef = ref<HTMLElement>();

// Ширина панели = ширина корневого элемента
const panelWidth = computed(() => rootRef.value?.offsetWidth);

// Ищем label выбранного пункта для отображения в MkInputDropdown
const displayLabel = computed(() => {
  if (!props.modelValue || !props.items?.length) return props.modelValue;
  const found = props.items.find((item) => item.value === props.modelValue);
  return found ? found.label : props.modelValue;
});

const rootClass = computed(() => [
  'mk-dropdown',
  {
    'mk-dropdown--disabled': props.disabled,
    'mk-dropdown--invalid': props.invalid,
    [`mk-dropdown--${props.size}`]: props.size,
  },
]);

const handleSelect = (item: DropdownItem) => {
  if (item.disabled) return;
  emit('update:modelValue', item.value);
  emit('change', item.value);
  open.value = false;
};
</script>

<style src="./MkDropdown.scss"></style>
