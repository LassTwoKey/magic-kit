import type { ModelValue } from '../types';

import type { ComputedRef, Ref } from 'vue';

export interface CheckboxGroupContext {
  modelValue: ComputedRef<ModelValue[] | undefined>;
  min: Ref<number | undefined>;
  max: Ref<number | undefined>;
  disabled: Ref<boolean | undefined>;
  size: Ref<string | undefined>;
  changeEvent: (value: ModelValue[]) => void;
}

export interface CheckboxEmit {
  (event: 'update:modelValue', val: ModelValue): void;
  (event: 'change', val: ModelValue, e?: Event): void;
}
