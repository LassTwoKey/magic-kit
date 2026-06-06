import type { ComputedRef, Ref } from 'vue';

/**
 * Данные узла дерева.
 */
export interface TreeNode {
  /** Уникальный ключ узла. */
  key: string | number;
  /** Текстовая метка. */
  label: string;
  /** Иконка узла — Vue-компонент или render-функция. */
  icon?: (() => any) | undefined;
  /** Дочерние узлы. */
  children?: TreeNode[];
  /** Узел заблокирован. */
  disabled?: boolean;
  /** Можно ли выбрать узел. */
  selectable?: boolean;
  /** Листовой узел — скрывает стрелку раскрытия. */
  leaf?: boolean;
  /** Показывает спиннер загрузки дочерних. */
  loading?: boolean;
  /** Произвольные данные. */
  data?: Record<string, unknown>;
}

/**
 * Режим выделения.
 */
export type SelectionMode = 'single' | 'multiple' | 'checkbox';

/**
 * Функция фильтрации узлов.
 */
export type FilterMethod = (query: string, node: TreeNode) => boolean;

/**
 * Контекст, предоставляемый MkTree через provide/inject.
 */
export interface TreeContext {
  selectionMode: ComputedRef<SelectionMode>;
  lazy: ComputedRef<boolean>;
  indent: ComputedRef<number>;
  selectLeafOnly: ComputedRef<boolean>;
  folderIcons: ComputedRef<boolean>;
  expandedKeys: ComputedRef<Set<string | number>>;
  selectedKeys: ComputedRef<Set<string | number>>;
  checkedKeys: ComputedRef<Set<string | number>>;
  toggleExpand: (key: string | number) => void;
  toggleSelect: (key: string | number) => void;
  toggleCheck: (key: string | number) => void;
  isHidden: (key: string | number) => boolean;
  isIndeterminate: (key: string | number) => boolean;
  getNode: (key: string | number) => TreeNode | undefined;
  filterQuery: Ref<string>;
}
