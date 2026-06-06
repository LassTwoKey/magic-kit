export type ModelValue = string | number | boolean;

export interface SwitchGroupContext {
  /** Auto-unwrapped value from the reactive context provided by MkSwitchGroup */
  modelValue: ModelValue | ModelValue[] | undefined;
  disabled: boolean | undefined;
  min: number | undefined;
  max: number | undefined;
  changeEvent: (val: ModelValue[]) => void;
}
