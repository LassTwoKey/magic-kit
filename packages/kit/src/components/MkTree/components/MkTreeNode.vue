<template>
  <div
    v-show="!hidden"
    :class="[
      'mk-tree-node',
      {
        'mk-tree-node--selected': isSelected,
        'mk-tree-node--disabled': isDisabled,
        'mk-tree-node--expanded': isExpanded,
      },
    ]"
    role="treeitem"
    :aria-expanded="hasChildren ? isExpanded : undefined"
    :aria-selected="isSelected || undefined"
    :aria-disabled="isDisabled || undefined"
  >
    <div
      class="mk-tree-node__content"
      @click="handleClick"
    >
      <!-- Чекбокс (режим checkbox) -->
      <span
        v-if="context.selectionMode.value === 'checkbox'"
        class="mk-tree-node__checkbox"
        @click.stop="handleCheck"
      >
        <span
          :class="[
            'mk-tree-node__checkbox-inner',
            {
              'mk-tree-node__checkbox-inner--checked': isChecked,
              'mk-tree-node__checkbox-inner--indeterminate': isNodeIndeterminate,
            },
          ]"
        >
          <MinusShape
            v-if="isNodeIndeterminate"
            class="mk-tree-node__checkbox-icon"
          />
          <CheckShape
            v-else-if="isChecked"
            class="mk-tree-node__checkbox-icon"
          />
        </span>
      </span>

      <!-- Содержимое с отступом -->
      <div
        class="mk-tree-node__inner"
        :style="{ paddingLeft: `${level * context.indent.value + 8}px` }"
      >
        <!-- Стрелка раскрытия -->
        <span
          v-if="showExpandToggle"
          class="mk-tree-node__expand"
          @click.stop="handleExpand"
        >
          <slot
            name="expandIcon"
            :is-expanded="isExpanded"
            :is-loading="node.loading ?? false"
          >
            <MkLoopIcon
              v-if="node.loading"
              class="mk-tree-node__loading-icon"
            />
            <MkChevronRightIcon
              v-else
              class="mk-tree-node__expand-icon"
            />
          </slot>
        </span>
        <span
          v-else
          class="mk-tree-node__expand mk-tree-node__expand--leaf"
        />

        <!-- Иконка узла -->
        <span
          v-if="showIcon"
          class="mk-tree-node__icon"
        >
          <slot
            name="icon"
            :node="node"
          >
            <template v-if="node.icon">
              <component :is="node.icon" />
            </template>
            <template v-else-if="hasChildren">
              <MkFolderOpenIcon
                v-if="isExpanded"
                class="mk-tree-node__folder-icon"
              />
              <MkFolderIcon
                v-else
                class="mk-tree-node__folder-icon"
              />
            </template>
          </slot>
        </span>

        <!-- Метка -->
        <span class="mk-tree-node__label">
          <slot
            :node="node"
            :is-selected="isSelected"
            :is-checked="isChecked"
            :is-expanded="isExpanded"
            :is-indeterminate="isNodeIndeterminate"
          >
            {{ node.label }}
          </slot>
        </span>
      </div>
    </div>

    <!-- Дочерние узлы -->
    <div
      v-if="hasChildren"
      v-show="isExpanded"
      class="mk-tree-node__children"
      role="group"
    >
      <MkTreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        :level="level + 1"
        :parent-disabled="isDisabled"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { treeKey } from '@magic/kit/constants';
import { MkChevronRightIcon, MkFolderIcon, MkFolderOpenIcon, MkLoopIcon } from '@magic/kit/icons';
import { CheckShape, MinusShape } from '@magic/kit/shapes';

import type { TreeContext, TreeNode } from '../types';

defineOptions({
  name: 'MkTreeNode',
});

/* eslint-disable no-unused-vars */
defineSlots<{
  expandIcon(props: { isExpanded: boolean; isLoading: boolean }): any;
  icon(props: { node: TreeNode }): any;
  default(props: {
    node: TreeNode;
    isSelected: boolean;
    isChecked: boolean;
    isExpanded: boolean;
    isIndeterminate: boolean;
  }): any;
}>();
/* eslint-enable no-unused-vars */

const props = defineProps<{
  node: TreeNode;
  level: number;
  parentDisabled?: boolean;
}>();

const context = inject<TreeContext>(treeKey)!;

const isExpanded = computed(() => context.expandedKeys.value.has(props.node.key));
const isSelected = computed(() => context.selectedKeys.value.has(props.node.key));
const isChecked = computed(() => context.checkedKeys.value.has(props.node.key));
const isNodeIndeterminate = computed(() => context.isIndeterminate(props.node.key));
const hidden = computed(() => context.isHidden(props.node.key));
const isDisabled = computed(() => props.node.disabled === true || props.parentDisabled === true);
const hasChildren = computed(() => !!(props.node.children && props.node.children.length));

const showIcon = computed(() => {
  if (props.node.icon) return true;
  return context.folderIcons.value && hasChildren.value;
});

const showExpandToggle = computed(() => {
  if (props.node.leaf) return false;
  return hasChildren.value || context.lazy.value;
});

function handleExpand() {
  context.toggleExpand(props.node.key);
}

function handleClick() {
  // Disabled-узлы можно раскрывать, но нельзя выбирать.
  if (isDisabled.value) {
    if (hasChildren.value) handleExpand();
    return;
  }

  // При selectLeafOnly родительские узлы только раскрываются.
  if (context.selectLeafOnly.value && hasChildren.value) {
    handleExpand();
    return;
  }

  context.selectionMode.value === 'checkbox'
    ? context.toggleCheck(props.node.key)
    : context.toggleSelect(props.node.key);
}

function handleCheck() {
  if (isDisabled.value) return;
  context.toggleCheck(props.node.key);
}
</script>

<style src="./MkTreeNode.scss"></style>
