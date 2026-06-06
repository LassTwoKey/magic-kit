<template>
  <label
    :class="[
      'mk-radio',
      {
        'mk-radio--disabled': disabled,
        'mk-radio--focus': focus,
        'mk-radio--checked': modelValue === actualValue,
      },
    ]"
  >
    <span :class="['mk-radio__input', { 'mk-radio__input--with-label': label }]">
      <input
        ref="radioRef"
        v-model="modelValue"
        class="mk-radio__original"
        :value="actualValue"
        :name="name"
        :disabled="disabled"
        :tabindex="tabIndex"
        type="radio"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        @click.stop
      />
      <span
        :class="[
          'mk-radio__inner',
          {
            'mk-radio__inner--disabled': disabled,
            'mk-radio__inner--checked': modelValue === actualValue,
          },
        ]"
        aria-hidden="true"
      />
    </span>
    <div
      v-if="label"
      class="mk-radio__content"
    >
      <div class="mk-radio__label">
        {{ label }}
      </div>
      <span
        v-if="tooltip"
        class="mk-radio__tooltip"
        aria-hidden="true"
      >
        <MkTooltip :content="tooltip">
          <MkHelpOutlineIcon class="mk-radio__tooltip-icon" />
        </MkTooltip>
      </span>
      <div
        v-if="description"
        class="mk-radio__description"
      >
        {{ description }}
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';
import { MkTooltip } from '@magic/kit/components/MkTooltip';
import { CHANGE_EVENT } from '@magic/kit/constants';
import { MkHelpOutlineIcon } from '@magic/kit/icons';

import type { Props, Emits } from './api';
import { useRadio } from './use-radio';

defineOptions({
  name: 'MkRadio',
});

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { focus, disabled, modelValue, actualValue, tabIndex, name, radioRef } = useRadio(
  props,
  emit
);

function handleChange() {
  nextTick(() => emit(CHANGE_EVENT, modelValue.value));
}
</script>

<style src="./MkRadio.scss"></style>
