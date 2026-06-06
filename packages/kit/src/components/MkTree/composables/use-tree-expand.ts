import { computed, ref, watch } from 'vue';

import type { TreeNode } from '../types';

import type { Ref } from 'vue';

interface UseTreeExpandOptions {
  expandedKeys: Ref<Array<string | number> | undefined>;
  defaultExpandedKeys: Ref<Array<string | number> | undefined>;
  lazy: Ref<boolean>;
  data: Ref<TreeNode[]>;
  emit: {
    (e: 'update:expandedKeys', keys: Array<string | number>): void;
    (e: 'node-expand', node: TreeNode, isExpanded: boolean): void;
  };
}

export function useTreeExpand(options: UseTreeExpandOptions) {
  const { expandedKeys, defaultExpandedKeys, lazy, data, emit } = options;

  const internalExpandedKeys = ref<Set<string | number>>(new Set(defaultExpandedKeys.value ?? []));

  const expandedSet = computed(() => {
    if (expandedKeys.value !== undefined) {
      return new Set(expandedKeys.value);
    }
    return internalExpandedKeys.value;
  });

  // Плоская карта узлов для O(1) доступа.
  const nodeMap = computed(() => {
    const map = new Map<string | number, TreeNode>();
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        map.set(node.key, node);
        if (node.children?.length) walk(node.children);
      }
    };
    walk(data.value);
    return map;
  });

  // Карта ключ → ключ родителя.
  const parentMap = computed(() => {
    const map = new Map<string | number, string | number>();
    const walk = (nodes: TreeNode[], parentKey?: string | number) => {
      for (const node of nodes) {
        if (parentKey !== undefined) map.set(node.key, parentKey);
        if (node.children?.length) walk(node.children, node.key);
      }
    };
    walk(data.value);
    return map;
  });

  function toggleExpand(key: string | number) {
    const node = nodeMap.value.get(key);
    if (!node) return;

    const next = new Set(expandedSet.value);
    const wasExpanded = next.has(key);

    if (wasExpanded) {
      next.delete(key);
    } else {
      next.add(key);
    }

    if (expandedKeys.value !== undefined) {
      emit('update:expandedKeys', [...next]);
    } else {
      internalExpandedKeys.value = next;
    }

    const isExpanded = !wasExpanded;

    // Ленивая загрузка: при первом раскрытии узла без children emit node-expand.
    if (isExpanded && lazy.value && !node.children?.length && !node.leaf) {
      emit('node-expand', node, true);
      return;
    }

    emit('node-expand', node, isExpanded);
  }

  function expandAll() {
    const keys = new Set<string | number>();
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.children?.length) {
          keys.add(node.key);
          walk(node.children);
        }
      }
    };
    walk(data.value);

    if (expandedKeys.value !== undefined) {
      emit('update:expandedKeys', [...keys]);
    } else {
      internalExpandedKeys.value = keys;
    }
  }

  function collapseAll() {
    if (expandedKeys.value !== undefined) {
      emit('update:expandedKeys', []);
    } else {
      internalExpandedKeys.value = new Set();
    }
  }

  watch(expandedKeys, (val) => {
    if (val !== undefined) {
      internalExpandedKeys.value = new Set(val);
    }
  });

  return { expandedSet, nodeMap, parentMap, toggleExpand, expandAll, collapseAll };
}
