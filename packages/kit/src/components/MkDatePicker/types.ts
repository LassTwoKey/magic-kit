export type PickerOptions = {
  /**
   * Функция для отключения дат. Должна возвращать Boolean.
   */
  disabledDate?: (date: Date) => boolean;
  /**
   * Первый день недели. Number (0 — воскресенье).
   */
  firstDayOfWeek?: number;
  /**
   * Callback при изменении выбранной даты. Только для range.
   */
  onPick?: (dates: Date[]) => void;
};
