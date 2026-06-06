export type ModelValue = string | number | boolean;

export type RadioGroupContext = {
  modelValue: ModelValue | undefined;
  disabled: boolean | undefined;
  name: string | undefined;
  changeEvent: (val: ModelValue) => void;
};
