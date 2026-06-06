import type { ComputedRef } from 'vue';

export interface AccordionContext {
  /** Текущий список открытых элементов. */
  openItems: ComputedRef<Set<string | number>>;
  /** Режим: true — несколько элементов, false — один. */
  multiple: ComputedRef<boolean>;
  /** Переключает элемент по имени. */
  toggleItem: (name: string | number) => void;
}
