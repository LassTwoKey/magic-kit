export type Props = {
  /**
   * Значение time-picker. Date по умолчанию, строка если задан valueFormat.
   */
  modelValue?: Date | string | null;
  /**
   * Формат отображаемого значения в поле ввода. По умолчанию 'HH:mm'.
   */
  format?: string;
  /**
   * Формат привязываемого значения. Если не задан, modelValue будет Date.
   */
  valueFormat?: string;
  /**
   * Плейсхолдер для поля ввода.
   */
  placeholder?: string;
  /**
   * Блокирует взаимодействие.
   */
  disabled?: boolean;
  /**
   * Показывать колонку секунд.
   */
  enableSeconds?: boolean;
  /**
   * Показывать кнопку очистки.
   */
  clearable?: boolean;
  /**
   * Текст ошибки, отображается под полем ввода. Наличие значения включает состояние ошибки.
   */
  error?: string;
};

export type Emits = {
  /**
   * Emit Срабатывает при изменении значения. Используется для v-model.
   */
  'update:modelValue': [val: Date | string | null];
  /**
   * Emit Срабатывает при подтверждении значения пользователем.
   */
  change: [val: Date | string | null];
};
