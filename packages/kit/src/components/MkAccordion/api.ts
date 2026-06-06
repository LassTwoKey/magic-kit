export type Props = {
  /**
   * Список открытых элементов (v-model).
   * Каждый элемент — `name` соответствующего `MkAccordionItem`.
   */
  modelValue?: Array<string | number>;
  /**
   * Если `true`, одновременно можно открыть несколько элементов.
   * Если `false` (по умолчанию), при открытии нового предыдущий закрывается.
   */
  multiple?: boolean;
};

export type Emits = {
  /** Обновление v-model. */
  'update:modelValue': [val: Array<string | number>];
  /** Вызывается при открытии элемента. */
  open: [name: string | number];
  /** Вызывается при закрытии элемента. */
  close: [name: string | number];
};

export type Slots = {
  /** Контент аккордеона — обычно `MkAccordionItem`. */
  default: any;
};
