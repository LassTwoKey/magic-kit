import { computed, ref, watch } from 'vue';

import type { SelectionMode, TreeNode } from '../types';

import type { ComputedRef, Ref } from 'vue';

interface UseTreeSelectionOptions {
  selectedKeys: Ref<Array<string | number> | undefined>;
  checkedKeys: Ref<Array<string | number> | undefined>;
  selectionMode: ComputedRef<SelectionMode>;
  nodeMap: ComputedRef<Map<string | number, TreeNode>>;
  parentMap: ComputedRef<Map<string | number, string | number>>;
  emit: {
    (e: 'update:selectedKeys', keys: Array<string | number>): void;
    (e: 'update:checkedKeys', keys: Array<string | number>): void;
    (e: 'node-select', node: TreeNode, isSelected: boolean): void;
    (e: 'node-check', node: TreeNode, isChecked: boolean): void;
  };
}

export function useTreeSelection(options: UseTreeSelectionOptions) {
  const { selectedKeys, checkedKeys, selectionMode, nodeMap, parentMap, emit } = options;

  // --- Selection (single / multiple) ---

  const internalSelectedKeys = ref<Set<string | number>>(new Set());

  const selectedSet = computed(() => {
    if (selectedKeys.value !== undefined) {
      return new Set(selectedKeys.value);
    }
    return internalSelectedKeys.value;
  });

  function toggleSelect(key: string | number) {
    const node = nodeMap.value.get(key);
    if (!node || node.disabled || node.selectable === false) return;

    let next: Set<string | number>;

    if (selectionMode.value === 'single') {
      next = selectedSet.value.has(key) ? new Set() : new Set([key]);
    } else {
      next = new Set(selectedSet.value);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
    }

    if (selectedKeys.value !== undefined) {
      emit('update:selectedKeys', [...next]);
    } else {
      internalSelectedKeys.value = next;
    }

    emit('node-select', node, next.has(key));
  }

  // --- Checkbox ---

  const internalCheckedKeys = ref<Set<string | number>>(new Set());

  const checkedSet = computed(() => {
    if (checkedKeys.value !== undefined) {
      return new Set(checkedKeys.value);
    }
    return internalCheckedKeys.value;
  });

  // Собирает все ключи-потомки.
  function getAllDescendantKeys(node: TreeNode): Array<string | number> {
    const keys: Array<string | number> = [];
    if (node.children?.length) {
      for (const child of node.children) {
        keys.push(child.key);
        keys.push(...getAllDescendantKeys(child));
      }
    }
    return keys;
  }

  // Обновляет состояние родителей: если все дети выбраны — выбирает родителя.
  function propagateUp(next: Set<string | number>, key: string | number) {
    let current = parentMap.value.get(key);
    while (current !== undefined) {
      const parent = nodeMap.value.get(current);
      if (!parent) break;

      const allChecked = parent.children?.every(
        (child) => child.disabled || next.has(child.key),
      );

      if (allChecked) {
        next.add(current);
      } else {
        next.delete(current);
      }

      current = parentMap.value.get(current);
    }
  }

  function isAllDescendantsChecked(node: TreeNode): boolean {
    if (!node.children?.length) return true;
    return node.children.every(
      (child) =>
        child.disabled || (checkedSet.value.has(child.key) && isAllDescendantsChecked(child))
    );
  }

  function hasCheckedDescendant(node: TreeNode): boolean {
    if (!node.children?.length) return false;
    return node.children.some(
      (child) => checkedSet.value.has(child.key) || hasCheckedDescendant(child)
    );
  }

  function toggleCheck(key: string | number) {
    const node = nodeMap.value.get(key);
    if (!node || node.disabled) return;

    const isChecked = checkedSet.value.has(key);
    const next = new Set(checkedSet.value);

    if (isChecked) {
      next.delete(key);
      for (const k of getAllDescendantKeys(node)) {
        next.delete(k);
      }
    } else {
      next.add(key);
      for (const k of getAllDescendantKeys(node)) {
        const descendant = nodeMap.value.get(k);
        if (!descendant?.disabled) next.add(k);
      }
    }

    // Обновляем родителей снизу вверх.
    propagateUp(next, key);

    if (checkedKeys.value !== undefined) {
      emit('update:checkedKeys', [...next]);
    } else {
      internalCheckedKeys.value = next;
    }

    emit('node-check', node, !isChecked);
  }

  function isIndeterminate(key: string | number): boolean {
    const node = nodeMap.value.get(key);
    if (!node?.children?.length) return false;
    if (checkedSet.value.has(key)) return false;
    return hasCheckedDescendant(node) && !isAllDescendantsChecked(node);
  }

  watch(selectedKeys, (val) => {
    if (val !== undefined) internalSelectedKeys.value = new Set(val);
  });
  watch(checkedKeys, (val) => {
    if (val !== undefined) internalCheckedKeys.value = new Set(val);
  });

  return {
    selectedSet,
    checkedSet,
    toggleSelect,
    toggleCheck,
    isIndeterminate,
  };
}
