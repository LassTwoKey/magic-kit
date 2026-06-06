import { computed, ref, watch } from 'vue';

import type { FilterMethod, TreeNode } from '../types';

import type { ComputedRef, Ref } from 'vue';

interface UseTreeFilterOptions {
  data: Ref<TreeNode[]>;
  filter: ComputedRef<boolean>;
  filterMethod: ComputedRef<FilterMethod | undefined>;
  expandedSet: ComputedRef<Set<string | number>>;
  toggleExpand: (key: string | number) => void;
  emit: {
    (e: 'filter-change', query: string): void;
  };
}

const defaultFilterMethod: FilterMethod = (query, node) => {
  return node.label.toLowerCase().includes(query.toLowerCase());
};

export function useTreeFilter(options: UseTreeFilterOptions) {
  const { data, filter, filterMethod, expandedSet, toggleExpand, emit } = options;

  const filterQuery = ref('');

  const resolvedFilterMethod = computed(() => filterMethod.value ?? defaultFilterMethod);

  // Ключи, проходящие фильтр, плюс все их предки.
  const visibleKeys = computed(() => {
    const query = filterQuery.value.trim();
    if (!filter.value || !query) return null;

    const visible = new Set<string | number>();
    const method = resolvedFilterMethod.value;

    function walk(nodes: TreeNode[]): boolean {
      let anyVisible = false;
      for (const node of nodes) {
        const selfMatch = method(query, node);
        const childMatch = node.children?.length ? walk(node.children) : false;
        if (selfMatch || childMatch) {
          visible.add(node.key);
          anyVisible = true;
        }
      }
      return anyVisible;
    }

    walk(data.value);
    return visible;
  });

  function isHidden(key: string | number): boolean {
    if (!visibleKeys.value) return false;
    return !visibleKeys.value.has(key);
  }

  // При фильтрации раскрываем предков видимых узлов.
  watch(filterQuery, (query) => {
    emit('filter-change', query);
    if (!visibleKeys.value || !query.trim()) return;

    const toExpand: Array<string | number> = [];
    function findAncestors(
      nodes: TreeNode[],
      target: Set<string | number>,
      path: Array<string | number>
    ) {
      for (const node of nodes) {
        if (target.has(node.key)) {
          for (const ancestor of path) toExpand.push(ancestor);
        }
        if (node.children?.length) {
          findAncestors(node.children, target, [...path, node.key]);
        }
      }
    }
    findAncestors(data.value, visibleKeys.value, []);

    for (const key of toExpand) {
      if (!expandedSet.value.has(key)) {
        toggleExpand(key);
      }
    }
  });

  return { filterQuery, visibleKeys, isHidden };
}
