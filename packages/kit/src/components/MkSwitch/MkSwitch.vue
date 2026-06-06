<template>
  <component
    :is="hasOwnLabel ? 'label' : 'span'"
    :class="[
      'mk-switch',
      {
        'mk-switch--disabled': isDisabled,
        'mk-switch--checked': isChecked,
        'mk-switch--focus': isFocused,
      },
    ]"
    @click="onClickRoot"
  >
    <span class="mk-switch__input">
      <input
        :id="id"
        v-model="model"
        class="mk-switch__original"
        type="checkbox"
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
          'mk-switch__inner',
          {
            'mk-switch__inner--disabled': isDisabled,
          },
        ]"
      >
        <span
          :class="[
            'mk-switch__track',
            {
              'mk-switch__track--checked': isChecked,
            },
          ]"
        ></span>
        <span
          :class="[
            'mk-switch__knob',
            {
              'mk-switch__knob--checked': isChecked,
            },
          ]"
        ></span>
      </span>
    </span>
    <div
      v-if="hasOwnLabel"
      class="mk-switch__content"
    >
      <span class="mk-switch__label">
        {{ label }}
      </span>
      <span
        v-if="tooltip"
        class="mk-switch__tooltip"
      >
        <MkTooltip :content="tooltip">
          <MkHelpOutlineIcon class="mk-switch__tooltip-icon" />
        </MkTooltip>
      </span>
      <span
        v-if="description"
        class="mk-switch__description"
      >
        {{ description }}
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { MkTooltip } from '@magic/kit/components/MkTooltip';
import { MkHelpOutlineIcon } from '@magic/kit/icons';

import type { Props, Emits } from './api';
import { useSwitch } from './composables';

defineOptions({
  name: 'MkSwitch',
});

const props = defineProps<Props>();

defineEmits<Emits>();

const slots = useSlots();

const {
  isChecked,
  isDisabled,
  isFocused,
  hasOwnLabel,
  model,
  actualValue,
  handleChange,
  onClickRoot,
} = useSwitch(props, slots);

const inputBindings = computed(() => {
  if (props.trueValue || props.falseValue) {
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

<style src="./MkSwitch.scss"></style>
