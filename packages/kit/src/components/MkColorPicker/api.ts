export type Props = {
  /**
   * Значение цвета в формате hex (например, #FF0000).
   */
  modelValue?: string;
  /**
   * Блокирует взаимодействие с пикером.
   */
  disabled?: boolean;
  /**
   * Текст ошибки, отображаемый под инпутом.
   */
  error?: string;
};

export type Emits = {
  /**
   * Emit Срабатывает при изменении значения. Используется для v-model.
   */
  'update:modelValue': [val: string];
  /**
   * Emit Срабатывает при потере фокуса или нажатии Enter.
   */
  change: [val: string];
};
