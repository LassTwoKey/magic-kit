<template>
  <div
    class="mk-tree"
    role="tree"
  >
    <!-- Поле фильтрации -->
    <div
      v-if="filter"
      class="mk-tree__filter"
    >
      <MkInput
        v-model="filterQuery"
        :placeholder="filterPlaceholder"
        clearable
        :prefix-icon="MkSearchIcon"
        size="sm"
      />
    </div>

    <!-- Дерево -->
    <div class="mk-tree__content">
      <template v-if="data.length">
        <MkTreeNode
          v-for="node in data"
          :key="node.key"
          :node="node"
          :level="0"
        >
          <template #expandIcon="scope">
            <slot
              name="expandIcon"
              v-bind="scope"
            />
          </template>
          <template #icon="scope">
            <slot
              name="icon"
              v-bind="scope"
            />
          </template>
          <template #default="scope">
            <slot v-bind="scope" />
          </template>
        </MkTreeNode>
      </template>
      <div
        v-else
        class="mk-tree__empty"
      >
        <slot
          name="empty"
          :query="filterQuery"
        >
          {{ emptyText }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRefs } from 'vue';
import { MkInput } from '@magic/kit/components/MkInput';
import { treeKey } from '@magic/kit/constants';
import { MkSearchIcon } from '@magic/kit/icons';

import type { Emits, Props, Slots } from './api';
import MkTreeNode from './components/MkTreeNode.vue';
import { useTreeExpand, useTreeSelection, useTreeFilter } from './composables';
import type { TreeContext } from './types';

defineOptions({
  name: 'MkTree',
});

const props = withDefaults(defineProps<Props>(), {
  selectedKeys: undefined,
  checkedKeys: undefined,
  expandedKeys: undefined,
  defaultExpandedKeys: undefined,
  selectionMode: 'single',
  lazy: false,
  filter: false,
  filterPlaceholder: 'Поиск...',
  filterMethod: undefined,
  disabled: false,
  indent: 24,
  emptyText: 'Нет данных',
  selectLeafOnly: false,
  folderIcons: false,
});

const emit = defineEmits<Emits>();
defineSlots<Slots>();

const {
  data,
  selectedKeys,
  checkedKeys,
  expandedKeys,
  defaultExpandedKeys,
  selectionMode,
  lazy,
  filter,
  filterMethod,
  indent,
  selectLeafOnly,
  folderIcons,
} = toRefs(props);

const selectionModeRef = computed(() => selectionMode.value);
const lazyRef = computed(() => lazy.value);
const indentRef = computed(() => indent.value);
const selectLeafOnlyRef = computed(() => selectLeafOnly.value);
const folderIconsRef = computed(() => folderIcons.value);
const filterRef = computed(() => filter.value);
const filterMethodRef = computed(() => filterMethod.value);

const { expandedSet, nodeMap, parentMap, toggleExpand } = useTreeExpand({
  expandedKeys,
  defaultExpandedKeys,
  lazy: lazyRef,
  data,
  emit,
});

const { selectedSet, checkedSet, toggleSelect, toggleCheck, isIndeterminate } = useTreeSelection({
  selectedKeys,
  checkedKeys,
  selectionMode: selectionModeRef,
  nodeMap,
  parentMap,
  emit,
});

const { filterQuery, isHidden } = useTreeFilter({
  data,
  filter: filterRef,
  filterMethod: filterMethodRef,
  expandedSet,
  toggleExpand,
  emit,
});

function getNode(key: string | number) {
  return nodeMap.value.get(key);
}

provide<TreeContext>(treeKey, {
  selectionMode: selectionModeRef,
  lazy: lazyRef,
  indent: indentRef,
  selectLeafOnly: selectLeafOnlyRef,
  folderIcons: folderIconsRef,
  expandedKeys: expandedSet,
  selectedKeys: selectedSet,
  checkedKeys: checkedSet,
  toggleExpand,
  toggleSelect,
  toggleCheck,
  isHidden,
  isIndeterminate,
  getNode,
  filterQuery,
});
</script>

<style src="./MkTree.scss"></style>
