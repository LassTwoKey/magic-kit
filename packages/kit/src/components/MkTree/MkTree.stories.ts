import { ref } from 'vue';
import { expect, fn, userEvent, within } from 'storybook/test';

import MkTree from './MkTree.vue';
import type { TreeNode } from './types';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

const sampleData: TreeNode[] = [
  {
    key: '1',
    label: 'Документы',
    children: [
      {
        key: '1-1',
        label: 'Рабочие документы',
        children: [
          { key: '1-1-1', label: 'Отчёт Q1' },
          { key: '1-1-2', label: 'Отчёт Q2' },
          { key: '1-1-3', label: 'Отчёт Q3' },
        ],
      },
      {
        key: '1-2',
        label: 'Личные документы',
        children: [
          { key: '1-2-1', label: 'Паспорт' },
          { key: '1-2-2', label: 'СНИЛС' },
        ],
      },
    ],
  },
  {
    key: '2',
    label: 'Загрузки',
    children: [
      { key: '2-1', label: 'Архив.zip' },
      { key: '2-2', label: 'Фото.jpg' },
    ],
  },
  {
    key: '3',
    label: 'Музыка',
    children: [
      { key: '3-1', label: 'Рок' },
      { key: '3-2', label: 'Джаз' },
      { key: '3-3', label: 'Классика' },
    ],
  },
  {
    key: '4',
    label:
      'Файл без потомков. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    leaf: true,
  },
];

/**
 * Истории для MkTree. Включает визуальные примеры, режимы выделения (single, multiple, checkbox), ленивую загрузку, фильтрацию, управление раскрытием, кастомные слоты, а также тесты ARIA-атрибутов, каскадного выбора чекбоксов, событий и доступности.
 */
const meta: Meta<typeof MkTree> = {
  title: 'Components/MkTree',
  component: MkTree,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', 'checkbox'],
    },
    filter: {
      control: 'boolean',
    },
    lazy: {
      control: 'boolean',
    },
    indent: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Basic: Story = {
  args: {
    data: sampleData,
    selectionMode: 'single',
  },
};

export const SingleSelection: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const selected = ref<Array<string | number>>([]);
      return { sampleData, selected };
    },
    template: `
      <div>
        <p>Выделено: {{ selected }}</p>
        <MkTree
          :data="sampleData"
          v-model:selected-keys="selected"
          selection-mode="single"
        />
      </div>
    `,
  }),
};

export const MultipleSelection: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const selected = ref<Array<string | number>>([]);
      return { sampleData, selected };
    },
    template: `
      <div>
        <p>Выделено: {{ selected }}</p>
        <MkTree
          :data="sampleData"
          v-model:selected-keys="selected"
          selection-mode="multiple"
        />
      </div>
    `,
  }),
};

export const CheckboxMode: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const checked = ref<Array<string | number>>([]);
      return { sampleData, checked };
    },
    template: `
      <div>
        <p>Отмечено: {{ checked }}</p>
        <MkTree
          :data="sampleData"
          v-model:checked-keys="checked"
          selection-mode="checkbox"
        />
      </div>
    `,
  }),
};

export const CheckboxWithDisabled: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: '1',
          label: 'Полностью доступный',
          children: [
            { key: '1-1', label: 'Дочерний 1' },
            { key: '1-2', label: 'Дочерний 2' },
          ],
        },
        {
          key: '2',
          label: 'Заблокированный родитель',
          disabled: true,
          children: [{ key: '2-1', label: 'Дочерний (тоже заблокирован)' }],
        },
        {
          key: '3',
          label: 'Частично заблокирован (1 доступный, 1 disabled)',
          children: [
            { key: '3-1', label: 'Доступный' },
            { key: '3-2', label: 'Заблокированный', disabled: true },
          ],
        },
        {
          key: '4',
          label: 'Все дети disabled',
          children: [
            { key: '4-1', label: 'Заблокированный 1', disabled: true },
            { key: '4-2', label: 'Заблокированный 2', disabled: true },
          ],
        },
      ];
      const checked = ref<Array<string | number>>([]);
      return { data, checked };
    },
    template: `
      <div>
        <p>Отмечено: {{ checked }}</p>
        <MkTree
          :data="data"
          v-model:checked-keys="checked"
          selection-mode="checkbox"
          folder-icons
        />
        <ul style="margin-top: 12px; font-size: 12px; color: #666;">
          <li>«Полностью доступный» — выбираются все дети и родитель</li>
          <li>«Заблокированный родитель» — нельзя выбрать, раскрывается</li>
          <li>«Частично заблокирован» — выбирается доступный ребёнок, родитель отмечается как выбранный (disabled-ребёнок не мешает)</li>
          <li>«Все дети disabled» — родитель отмечается, disabled-дети не отмечаются</li>
        </ul>
      </div>
    `,
  }),
};

export const LazyLoading: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const data = ref<TreeNode[]>([
        { key: '1', label: 'Папка 1' },
        { key: '2', label: 'Папка 2' },
        { key: '3', label: 'Файл', leaf: true },
      ]);

      const expandedKeys = ref<Array<string | number>>([]);

      function onNodeExpand(node: TreeNode) {
        if (node.children?.length) return;

        // Имитация загрузки.
        const n = node;
        n.loading = true;

        setTimeout(() => {
          n.loading = false;
          n.children = [
            { key: `${n.key}-1`, label: `Дочерний 1 (${n.label})` },
            { key: `${n.key}-2`, label: `Дочерний 2 (${n.label})` },
          ];
        }, 1500);
      }

      return { data, expandedKeys, onNodeExpand };
    },
    template: `
      <div>
        <p>Раскрыто: {{ expandedKeys }}</p>
        <MkTree
          :data="data"
          v-model:expanded-keys="expandedKeys"
          lazy
          @node-expand="onNodeExpand"
        />
      </div>
    `,
  }),
};

export const WithFilter: Story = {
  args: {
    data: sampleData,
    filter: true,
    selectionMode: 'single',
  },
};

export const WithCustomFilter: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const filterMethod = (query: string, node: TreeNode) => {
        return node.label.toLowerCase().startsWith(query.toLowerCase());
      };
      return { sampleData, filterMethod };
    },
    template: `
      <MkTree
        :data="sampleData"
        filter
        :filter-method="filterMethod"
        filter-placeholder="Начинается с..."
        selection-mode="single"
      />
    `,
  }),
};

export const ControlledExpanded: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const expandedKeys = ref<Array<string | number>>(['1']);
      return { sampleData, expandedKeys };
    },
    template: `
      <div>
        <p>Раскрыто: {{ expandedKeys }}</p>
        <MkTree
          :data="sampleData"
          v-model:expanded-keys="expandedKeys"
          selection-mode="single"
        />
      </div>
    `,
  }),
};

export const CustomIndent: Story = {
  args: {
    data: sampleData,
    indent: 40,
    selectionMode: 'single',
  },
};

export const SelectLeafOnly: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const selected = ref<Array<string | number>>([]);
      return { sampleData, selected };
    },
    template: `
      <div>
        <p>Выделено (только листья): {{ selected }}</p>
        <MkTree
          :data="sampleData"
          v-model:selected-keys="selected"
          selection-mode="multiple"
          select-leaf-only
        />
      </div>
    `,
  }),
};

export const WithFolderIcons: Story = {
  args: {
    data: sampleData,
    folderIcons: true,
    selectionMode: 'single',
  },
};

export const CustomNodeSlot: Story = {
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: '1',
          label: 'Папка',
          children: [
            { key: '1-1', label: '1_Copy_Copy24_Копия (1)' },
            { key: '1-2', label: '2_Copy_Copy24_Копия (2)' },
            { key: '1-3', label: '3_Copy_Copy24_Копия (3)' },
          ],
        },
        {
          key: '2',
          label: 'Другая папка',
          children: [
            { key: '2-1', label: 'document_final.docx' },
            { key: '2-2', label: 'presentation.pptx' },
          ],
        },
      ];

      const checked = ref<Array<string | number>>([]);

      return { data, checked };
    },
    template: `
      <div>
        <p>Отмечено: {{ checked }}</p>
        <MkTree
          :data="data"
          v-model:checked-keys="checked"
          selection-mode="checkbox"
          folder-icons
        >
          <template #default="{ node }">
            <span
              :style="{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                overflow: 'hidden',
                fontSize: '13px',
                fontWeight: 600,
              }"
            >
              <span
                v-if="!node.children || !node.children.length"
                :style="{
                  flexShrink: 0,
                  padding: '0px 12px',
                  fontSize: '11px',
                  lineHeight: '18px',
                  fontWeight: 600,
                  color: 'var(--mk-color-gray-800)',
                  backgroundColor: 'var(--mk-color-red-100)',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                }"
              >
                inApp
              </span>
              <span
                :style="{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }"
              >
                {{ node.label }}
              </span>
            </span>
          </template>
        </MkTree>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasTreeClass: Story = {
  name: 'Test: имеет класс mk-tree',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-tree');
    await expect(root).toBeInTheDocument();
  },
};

export const HasTreeRole: Story = {
  name: 'Test: корень имеет role="tree"',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const tree = canvasElement.querySelector('[role="tree"]');
    await expect(tree).toBeInTheDocument();
  },
};

export const HasNodeRole: Story = {
  name: 'Test: узлы имеют role="treeitem"',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const nodes = canvasElement.querySelectorAll('[role="treeitem"]');
    await expect(nodes.length).toBeGreaterThan(0);
  },
};

export const HasChildrenRole: Story = {
  name: 'Test: дочерние контейнеры имеют role="group"',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('[role="group"]');
    await expect(groups.length).toBeGreaterThan(0);
  },
};

export const LeafNoExpandToggle: Story = {
  name: 'Test: листовой узел без потомков не имеет стрелки раскрытия',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const leaf = canvas.getByText('Файл без потомков', { exact: false });
    const node = leaf.closest('.mk-tree-node');
    const expand = node?.querySelector('.mk-tree-node__expand');
    await expect(expand).toHaveClass('mk-tree-node__expand--leaf');
  },
};

// ─────────────────────────────────────────────
// Раскрытие / сворачивание
// ─────────────────────────────────────────────

export const ExpandOnArrowClick: Story = {
  name: 'Test: клик по стрелке раскрывает узел',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const docNode = canvas.getByText('Документы');
    const node = docNode.closest('.mk-tree-node');
    const expandBtn = node?.querySelector('.mk-tree-node__expand') as HTMLElement;
    await expect(expandBtn).toBeInTheDocument();
    await userEvent.click(expandBtn);
    await expect(node).toHaveClass('mk-tree-node--expanded');
  },
};

export const CollapseOnSecondClick: Story = {
  name: 'Test: повторный клик по стрелке сворачивает узел',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const docNode = canvas.getByText('Документы');
    const node = docNode.closest('.mk-tree-node');
    const expandBtn = node?.querySelector('.mk-tree-node__expand') as HTMLElement;

    await userEvent.click(expandBtn);
    await expect(node).toHaveClass('mk-tree-node--expanded');

    await userEvent.click(expandBtn);
    await expect(node).not.toHaveClass('mk-tree-node--expanded');
  },
};

export const ExpandedAriaAttribute: Story = {
  name: 'Test: раскрытый узел имеет aria-expanded="true"',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const docNode = canvas.getByText('Документы');
    const node = docNode.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = node?.querySelector('.mk-tree-node__expand') as HTMLElement;

    await userEvent.click(expandBtn);
    await expect(node).toHaveAttribute('aria-expanded', 'true');
  },
};

// ─────────────────────────────────────────────
// Выделение (single / multiple)
// ─────────────────────────────────────────────

export const SingleSelectOnLabelClick: Story = {
  name: 'Test: клик по метке выделяет узел в режиме single',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Музыка');
    const node = label.closest('.mk-tree-node') as HTMLElement;
    await userEvent.click(label);
    await expect(node).toHaveClass('mk-tree-node--selected');
    await expect(node).toHaveAttribute('aria-selected', 'true');
  },
};

export const SingleSelectDeselectsPrevious: Story = {
  name: 'Test: single-режим снимает выделение с предыдущего',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const music = canvas.getByText('Музыка');
    const downloads = canvas.getByText('Загрузки');

    const musicNode = music.closest('.mk-tree-node') as HTMLElement;
    const downloadsNode = downloads.closest('.mk-tree-node') as HTMLElement;

    await userEvent.click(music);
    await expect(musicNode).toHaveClass('mk-tree-node--selected');

    await userEvent.click(downloads);
    await expect(downloadsNode).toHaveClass('mk-tree-node--selected');
    await expect(musicNode).not.toHaveClass('mk-tree-node--selected');
  },
};

export const MultipleSelectKeepsPrevious: Story = {
  name: 'Test: multiple-режим сохраняет выделение предыдущих',
  args: { data: sampleData, selectionMode: 'multiple' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const music = canvas.getByText('Музыка');
    const downloads = canvas.getByText('Загрузки');

    const musicNode = music.closest('.mk-tree-node') as HTMLElement;
    const downloadsNode = downloads.closest('.mk-tree-node') as HTMLElement;

    await userEvent.click(music);
    await expect(musicNode).toHaveClass('mk-tree-node--selected');

    await userEvent.click(downloads);
    await expect(downloadsNode).toHaveClass('mk-tree-node--selected');
    await expect(musicNode).toHaveClass('mk-tree-node--selected');
  },
};

export const DeselectOnSecondClick: Story = {
  name: 'Test: повторный клик снимает выделение',
  args: { data: sampleData, selectionMode: 'multiple' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Музыка');
    const node = label.closest('.mk-tree-node') as HTMLElement;

    await userEvent.click(label);
    await expect(node).toHaveClass('mk-tree-node--selected');

    await userEvent.click(label);
    await expect(node).not.toHaveClass('mk-tree-node--selected');
  },
};

// ─────────────────────────────────────────────
// Checkbox
// ─────────────────────────────────────────────

export const CheckboxCheckOnLabelClick: Story = {
  name: 'Test: клик по метке отмечает чекбокс',
  args: { data: sampleData, selectionMode: 'checkbox' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Музыка');
    const node = label.closest('.mk-tree-node') as HTMLElement;
    await userEvent.click(label);
    const checkbox = node.querySelector('.mk-tree-node__checkbox-inner');
    await expect(checkbox).toHaveClass('mk-tree-node__checkbox-inner--checked');
  },
};

export const CheckboxCascadeDown: Story = {
  name: 'Test: отметка родителя отмечает всех потомков',
  args: { data: sampleData, selectionMode: 'checkbox' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const docs = canvas.getByText('Документы');
    await userEvent.click(docs);

    // Дочерние узлы должны появиться — проверяем через эмит.
    const docsNode = docs.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = docsNode.querySelector('.mk-tree-node__expand') as HTMLElement;
    await userEvent.click(expandBtn);

    const work = canvas.getByText('Рабочие документы');
    const workNode = work.closest('.mk-tree-node') as HTMLElement;
    const workCheckbox = workNode.querySelector('.mk-tree-node__checkbox-inner');
    await expect(workCheckbox).toHaveClass('mk-tree-node__checkbox-inner--checked');
  },
};

export const CheckboxUncheckCascadeDown: Story = {
  name: 'Test: снятие отметки с родителя снимает всех потомков',
  args: { data: sampleData, selectionMode: 'checkbox' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const docs = canvas.getByText('Документы');

    // Отмечаем.
    await userEvent.click(docs);

    // Раскрываем.
    const docsNode = docs.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = docsNode.querySelector('.mk-tree-node__expand') as HTMLElement;
    await userEvent.click(expandBtn);

    // Снимаем.
    await userEvent.click(docs);

    const work = canvas.getByText('Рабочие документы');
    const workNode = work.closest('.mk-tree-node') as HTMLElement;
    const workCheckbox = workNode.querySelector('.mk-tree-node__checkbox-inner');
    await expect(workCheckbox).not.toHaveClass('mk-tree-node__checkbox-inner--checked');
  },
};

export const CheckboxCascadeUp: Story = {
  name: 'Test: отметка всех детей отмечает родителя',
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: 'parent',
          label: 'Родитель',
          children: [
            { key: 'c1', label: 'Ребёнок 1' },
            { key: 'c2', label: 'Ребёнок 2' },
          ],
        },
      ];
      const checked = ref<Array<string | number>>([]);
      return { data, checked };
    },
    template: `
      <MkTree :data="data" v-model:checked-keys="checked" selection-mode="checkbox" />
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Раскрываем.
    const parent = canvas.getByText('Родитель');
    const parentNode = parent.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = parentNode.querySelector('.mk-tree-node__expand') as HTMLElement;
    await userEvent.click(expandBtn);

    // Отмечаем детей.
    await userEvent.click(canvas.getByText('Ребёнок 1'));
    await userEvent.click(canvas.getByText('Ребёнок 2'));

    const parentCheckbox = parentNode.querySelector('.mk-tree-node__checkbox-inner');
    await expect(parentCheckbox).toHaveClass('mk-tree-node__checkbox-inner--checked');
  },
};

export const CheckboxIndeterminate: Story = {
  name: 'Test: частичная отметка детей показывает indeterminate у родителя',
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: 'parent',
          label: 'Родитель',
          children: [
            { key: 'c1', label: 'Ребёнок 1' },
            { key: 'c2', label: 'Ребёнок 2' },
          ],
        },
      ];
      const checked = ref<Array<string | number>>([]);
      return { data, checked };
    },
    template: `
      <MkTree :data="data" v-model:checked-keys="checked" selection-mode="checkbox" />
    `,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Раскрываем.
    const parent = canvas.getByText('Родитель');
    const parentNode = parent.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = parentNode.querySelector('.mk-tree-node__expand') as HTMLElement;
    await userEvent.click(expandBtn);

    // Отмечаем только одного ребёнка.
    await userEvent.click(canvas.getByText('Ребёнок 1'));

    const parentCheckbox = parentNode.querySelector('.mk-tree-node__checkbox-inner');
    await expect(parentCheckbox).toHaveClass('mk-tree-node__checkbox-inner--indeterminate');
  },
};

// ─────────────────────────────────────────────
// Disabled-узлы
// ─────────────────────────────────────────────

export const DisabledNodeNotSelectable: Story = {
  name: 'Test: disabled-узел не выделяется',
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        { key: '1', label: 'Доступный' },
        { key: '2', label: 'Заблокированный', disabled: true },
      ];
      return { data };
    },
    template: `<MkTree :data="data" selection-mode="single" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getByText('Заблокированный');
    const node = disabled.closest('.mk-tree-node') as HTMLElement;

    await expect(node).toHaveClass('mk-tree-node--disabled');
    await expect(node).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(disabled, { pointerEventsCheck: 0 });
    await expect(node).not.toHaveClass('mk-tree-node--selected');
  },
};

export const DisabledNodeExpandable: Story = {
  name: 'Test: disabled-узел раскрывается',
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: '1',
          label: 'Заблокированный',
          disabled: true,
          children: [{ key: '1-1', label: 'Дочерний' }],
        },
      ];
      return { data };
    },
    template: `<MkTree :data="data" selection-mode="single" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getByText('Заблокированный');
    const node = disabled.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = node.querySelector('.mk-tree-node__expand') as HTMLElement;

    await userEvent.click(expandBtn);
    await expect(node).toHaveClass('mk-tree-node--expanded');
  },
};

export const DisabledParentDisablesChildren: Story = {
  name: 'Test: disabled-родитель делает детей disabled',
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: '1',
          label: 'Родитель',
          disabled: true,
          children: [{ key: '1-1', label: 'Ребёнок' }],
        },
      ];
      return { data };
    },
    template: `<MkTree :data="data" selection-mode="single" />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Раскрываем.
    const parent = canvas.getByText('Родитель');
    const parentNode = parent.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = parentNode.querySelector('.mk-tree-node__expand') as HTMLElement;
    await userEvent.click(expandBtn);

    const child = canvas.getByText('Ребёнок');
    const childNode = child.closest('.mk-tree-node') as HTMLElement;
    await expect(childNode).toHaveClass('mk-tree-node--disabled');

    await userEvent.click(child, { pointerEventsCheck: 0 });
    await expect(childNode).not.toHaveClass('mk-tree-node--selected');
  },
};

// ─────────────────────────────────────────────
// selectLeafOnly
// ─────────────────────────────────────────────

export const SelectLeafOnlyExpandsParent: Story = {
  name: 'Test: selectLeafOnly — клик по родителю раскрывает, но не выделяет',
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: '1',
          label: 'Папка',
          children: [{ key: '1-1', label: 'Файл' }],
        },
      ];
      const selected = ref<Array<string | number>>([]);
      return { data, selected };
    },
    template: `<MkTree :data="data" v-model:selected-keys="selected" selection-mode="multiple" select-leaf-only />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const parent = canvas.getByText('Папка');
    const parentNode = parent.closest('.mk-tree-node') as HTMLElement;

    await userEvent.click(parent);
    await expect(parentNode).toHaveClass('mk-tree-node--expanded');
    await expect(parentNode).not.toHaveClass('mk-tree-node--selected');
  },
};

export const SelectLeafOnlySelectsLeaf: Story = {
  name: 'Test: selectLeafOnly — клик по листу выделяет',
  render: () => ({
    components: { MkTree },
    setup() {
      const data: TreeNode[] = [
        {
          key: '1',
          label: 'Папка',
          children: [{ key: '1-1', label: 'Файл' }],
        },
      ];
      const selected = ref<Array<string | number>>([]);
      return { data, selected };
    },
    template: `<MkTree :data="data" v-model:selected-keys="selected" selection-mode="multiple" select-leaf-only />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Раскрываем.
    const parent = canvas.getByText('Папка');
    const parentNode = parent.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = parentNode.querySelector('.mk-tree-node__expand') as HTMLElement;
    await userEvent.click(expandBtn);

    const leaf = canvas.getByText('Файл');
    const leafNode = leaf.closest('.mk-tree-node') as HTMLElement;
    await userEvent.click(leaf);
    await expect(leafNode).toHaveClass('mk-tree-node--selected');
  },
};

// ─────────────────────────────────────────────
// Фильтрация
// ─────────────────────────────────────────────

export const FilterInputVisible: Story = {
  name: 'Test: filter показывает поле ввода',
  args: { data: sampleData, filter: true, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const filterInput = canvasElement.querySelector('.mk-tree__filter input');
    await expect(filterInput).toBeInTheDocument();
  },
};

export const FilterHidesNonMatching: Story = {
  name: 'Test: фильтр скрывает несовпадающие узлы',
  args: { data: sampleData, filter: true, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('.mk-tree__filter input') as HTMLInputElement;

    await userEvent.type(input, 'Музыка');

    // «Музыка» видим.
    const music = canvas.getByText('Музыка');
    const musicNode = music.closest('.mk-tree-node') as HTMLElement;
    await expect(musicNode).toBeVisible();

    // «Документы» скрыт.
    const docs = canvas.queryByText('Документы');
    if (docs) {
      const docsNode = docs.closest('.mk-tree-node') as HTMLElement;
      await expect(docsNode).not.toBeVisible();
    }
  },
};

export const FilterShowsMatchingChildren: Story = {
  name: 'Test: фильтр раскрывает путь к совпадению',
  args: { data: sampleData, filter: true, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector('.mk-tree__filter input') as HTMLInputElement;

    await userEvent.type(input, 'Отчёт Q1');

    // «Документы» должен быть раскрыт и видимый путь.
    const docs = canvas.getByText('Документы');
    const docsNode = docs.closest('.mk-tree-node') as HTMLElement;
    await expect(docsNode).toHaveClass('mk-tree-node--expanded');

    const report = canvas.getByText('Отчёт Q1');
    const reportNode = report.closest('.mk-tree-node') as HTMLElement;
    await expect(reportNode).toBeVisible();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsNodeSelect: Story = {
  name: 'Test: эмитит node-select при выделении',
  args: {
    data: sampleData,
    selectionMode: 'single',
    onNodeSelect: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const handler = (args as unknown as Record<string, ReturnType<typeof fn>>).onNodeSelect;
    const canvas = within(canvasElement);
    const label = canvas.getByText('Музыка');
    await userEvent.click(label);
    await expect(handler).toHaveBeenCalledTimes(1);
  },
};

export const EmitsNodeExpand: Story = {
  name: 'Test: эмитит node-expand при раскрытии',
  args: {
    data: sampleData,
    selectionMode: 'single',
    onNodeExpand: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const handler = (args as unknown as Record<string, ReturnType<typeof fn>>).onNodeExpand;
    const canvas = within(canvasElement);
    const doc = canvas.getByText('Документы');
    const node = doc.closest('.mk-tree-node') as HTMLElement;
    const expandBtn = node.querySelector('.mk-tree-node__expand') as HTMLElement;
    await userEvent.click(expandBtn);
    await expect(handler).toHaveBeenCalledTimes(1);
  },
};

export const EmitsNodeCheck: Story = {
  name: 'Test: эмитит node-check при отметке чекбокса',
  args: {
    data: sampleData,
    selectionMode: 'checkbox',
    onNodeCheck: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const handler = (args as unknown as Record<string, ReturnType<typeof fn>>).onNodeCheck;
    const canvas = within(canvasElement);
    const label = canvas.getByText('Музыка');
    await userEvent.click(label);
    await expect(handler).toHaveBeenCalledTimes(1);
  },
};

// ─────────────────────────────────────────────
// folderIcons
// ─────────────────────────────────────────────

export const FolderIconsVisible: Story = {
  name: 'Test: folderIcons показывает иконку папки',
  args: { data: sampleData, folderIcons: true, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const docs = canvas.getByText('Документы');
    const node = docs.closest('.mk-tree-node') as HTMLElement;
    const icon = node.querySelector('.mk-tree-node__folder-icon');
    await expect(icon).toBeInTheDocument();
  },
};

export const NoFolderIconsByDefault: Story = {
  name: 'Test: без folderIcons нет иконки папки',
  args: { data: sampleData, selectionMode: 'single' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const docs = canvas.getByText('Документы');
    const node = docs.closest('.mk-tree-node') as HTMLElement;
    const icon = node.querySelector('.mk-tree-node__folder-icon');
    await expect(icon).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Пустое состояние
// ─────────────────────────────────────────────

export const EmptyData: Story = {
  name: 'Test: пустые данные показывают empty-текст',
  args: { data: [], selectionMode: 'single', emptyText: 'Нет данных' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const empty = canvas.getByText('Нет данных');
    await expect(empty).toBeInTheDocument();
  },
};

export const CustomEmptyText: Story = {
  name: 'Test: кастомный emptyText отображается',
  args: { data: [], selectionMode: 'single', emptyText: 'Ничего не найдено' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const empty = canvas.getByText('Ничего не найдено');
    await expect(empty).toBeInTheDocument();
  },
};
