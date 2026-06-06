import type { TreeNode, SelectionMode, FilterMethod } from './types';

export type Props = {
  /**
   * Массив данных узлов.
   */
  data: TreeNode[];
  /**
   * Выделенные ключи (v-model:selectedKeys).
   */
  selectedKeys?: Array<string | number>;
  /**
   * Отмеченные ключи — для checkbox (v-model:checkedKeys).
   */
  checkedKeys?: Array<string | number>;
  /**
   * Раскрытые ключи (v-model:expandedKeys).
   */
  expandedKeys?: Array<string | number>;
  /**
   * Изначально раскрытые ключи (без v-model).
   */
  defaultExpandedKeys?: Array<string | number>;
  /**
   * Режим выделения.
   */
  selectionMode?: SelectionMode;
  /**
   * Ленивая загрузка дочерних узлов.
   */
  lazy?: boolean;
  /**
   * Показывает поле фильтрации.
   */
  filter?: boolean;
  /**
   * Placeholder для фильтрации.
   */
  filterPlaceholder?: string;
  /**
   * Кастомная функция фильтрации.
   */
  filterMethod?: FilterMethod;
  /**
   * Заблокировать всё дерево.
   */
  disabled?: boolean;
  /**
   * Отступ на каждый уровень вложенности (px).
   */
  indent?: number;
  /**
   * Текст при отсутствии данных.
   */
  emptyText?: string;
  /**
   * Если `true`, выбрать можно только листовые узлы (без дочерних).
   * Клик по родительскому узлу только раскрывает/сворачивает его.
   */
  selectLeafOnly?: boolean;
  /**
   * Показывать иконки папок для родительских узлов.
   */
  folderIcons?: boolean;
};

export type Emits = {
  'update:selectedKeys': [keys: Array<string | number>];
  'update:checkedKeys': [keys: Array<string | number>];
  'update:expandedKeys': [keys: Array<string | number>];
  /** Клик по узлу. */
  'node-click': [node: TreeNode];
  /** Выделение/снятие выделения. */
  'node-select': [node: TreeNode, isSelected: boolean];
  /** Отметка/снятие отметки (checkbox). */
  'node-check': [node: TreeNode, isChecked: boolean];
  /** Раскрытие/сворачивание узла. */
  'node-expand': [node: TreeNode, isExpanded: boolean];
  /** Изменение фильтра. */
  'filter-change': [query: string];
};

export type Slots = {
  /** Кастомный рендер узла. */
  default: {
    node: TreeNode;
    isSelected: boolean;
    isChecked: boolean;
    isExpanded: boolean;
    isIndeterminate: boolean;
  };
  /** Кастомная иконка раскрытия. */
  expandIcon: { isExpanded: boolean; isLoading: boolean };
  /** Контент при пустом дереве. */
  empty: { query: string };
  /** Кастомная иконка узла. */
  icon: { node: TreeNode };
};
