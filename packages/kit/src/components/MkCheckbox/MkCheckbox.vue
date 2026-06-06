<template>
  <component
    :is="hasOwnLabel ? 'label' : 'span'"
    :class="[
      'mk-checkbox',
      {
        [`mk-checkbox--${checkboxSize}`]: checkboxSize,
        'mk-checkbox--disabled': isDisabled,
        'mk-checkbox--checked': isChecked,
        'mk-checkbox--indeterminate': props.indeterminate,
        'mk-checkbox--focus': isFocused,
      },
    ]"
    @click="onClickRoot"
  >
    <span
      :class="[
        'mk-checkbox__input',
        {
          'mk-checkbox__input--with-label': hasOwnLabel,
        },
      ]"
    >
      <input
        :id="id"
        v-model="model"
        class="mk-checkbox__original"
        type="checkbox"
        :indeterminate="indeterminate"
        :name="name"
        :tabindex="tabindex"
        :disabled="isDisabled"
        v-bind="inputBindings"
        @change="handleChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @click.stop
      />
      <span
        :class="[
          'mk-checkbox__inner',
          {
            'mk-checkbox__inner--disabled': isDisabled,
            'mk-checkbox__inner--checked': isChecked,
            'mk-checkbox__inner--indeterminate': props.indeterminate,
            [`mk-checkbox__inner--${checkboxSize}`]: checkboxSize,
          },
        ]"
      >
        <MinusShape
          v-if="props.indeterminate"
          :class="[
            'mk-checkbox__icon',
            {
              [`mk-checkbox__icon--${checkboxSize}`]: checkboxSize,
            },
          ]"
          aria-hidden="true"
        />
        <CheckShape
          v-else-if="isChecked"
          :class="[
            'mk-checkbox__icon',
            {
              [`mk-checkbox__icon--${checkboxSize}`]: checkboxSize,
            },
          ]"
          aria-hidden="true"
        />
      </span>
    </span>
    <div
      v-if="hasOwnLabel"
      class="mk-checkbox__content"
    >
      <span class="mk-checkbox__label">
        {{ label }}
      </span>
      <span
        v-if="tooltip"
        class="mk-checkbox__tooltip"
      >
        <MkTooltip :content="tooltip">
          <MkHelpOutlineIcon class="mk-checkbox__tooltip-icon" />
        </MkTooltip>
      </span>
      <span
        v-if="description"
        class="mk-checkbox__description"
      >
        {{ description }}
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MkTooltip } from '@magic/kit/components/MkTooltip';
import { MkHelpOutlineIcon } from '@magic/kit/icons';
import { CheckShape, MinusShape } from '@magic/kit/shapes';

import type { Emits, Props } from './api';
import { useCheckbox } from './composables';

defineOptions({
  name: 'MkCheckbox',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const {
  isChecked,
  isDisabled,
  isFocused,
  checkboxSize,
  hasOwnLabel,
  model,
  actualValue,
  handleChange,
  onClickRoot,
} = useCheckbox(props, emit);

const inputBindings = computed(() => {
  if (props.trueValue !== undefined || props.falseValue !== undefined) {
    return {
      'true-value': props.trueValue ?? true,
      'false-value': props.falseValue ?? false,
    };
  }
  return {
    value: actualValue.value,
  };
});
</script>

<style src="./MkCheckbox.scss"></style>
