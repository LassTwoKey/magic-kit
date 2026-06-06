import { markRaw } from 'vue';
import { MkDateRangeIcon, MkDoneIcon } from '@magic/kit/icons';
import { expect, fn, userEvent } from 'storybook/test';

import MkDropdownItem from './MkDropdownItem.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkDropdownItem. Включает визуальные примеры и тесты структуры DOM,
 * классов состояний, контента, disabled и событий.
 */
const meta = {
  title: 'Components/Dropdown/MkDropdownItem',
  component: MkDropdownItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof MkDropdownItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Default: Story = {
  args: { label: 'Пункт меню' },
};

export const Active: Story = {
  args: { label: 'Выбранный пункт', active: true },
};

export const Disabled: Story = {
  args: { label: 'Заблокированный', disabled: true },
};

export const WithPrefixIconSlot: Story = {
  name: 'Prefix icon (slot)',
  render: () => ({
    components: { MkDropdownItem, MkDateRangeIcon },
    template: `<mk-dropdown-item label="Дата"><template #prefixIcon><MkDateRangeIcon /></template></mk-dropdown-item>`,
  }),
};

export const WithPrefixIconProp: Story = {
  name: 'Prefix icon (prop)',
  render: () => ({
    components: { MkDropdownItem },
    setup() {
      return { MkDateRangeIcon: markRaw(MkDateRangeIcon) };
    },
    template: `<mk-dropdown-item label="Дата" :icon="MkDateRangeIcon" />`,
  }),
};

export const WithSuffix: Story = {
  name: 'Suffix content',
  render: () => ({
    components: { MkDropdownItem },
    template: `<mk-dropdown-item label="Сохранить"><template #suffix><span>⌘S</span></template></mk-dropdown-item>`,
  }),
};

export const WithIconAndSuffix: Story = {
  name: 'Icon + Suffix',
  render: () => ({
    components: { MkDropdownItem, MkDoneIcon },
    template: `<mk-dropdown-item label="Подтвердить" :active="true"><template #prefixIcon><MkDoneIcon /></template><template #suffix><span>✓</span></template></mk-dropdown-item>`,
  }),
};

export const CustomContent: Story = {
  name: 'Custom content (default slot)',
  render: () => ({
    components: { MkDropdownItem, MkDoneIcon },
    template: `<mk-dropdown-item><template #prefixIcon><MkDoneIcon /></template><template #default><strong>Жирный текст</strong></template></mk-dropdown-item>`,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    components: { MkDropdownItem, MkDateRangeIcon, MkDoneIcon },
    template: `
      <div style="display: flex; flex-direction: column; width: 240px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden">
        <mk-dropdown-item label="Обычный" />
        <mk-dropdown-item label="Активный" :active="true" />
        <mk-dropdown-item label="Заблокированный" :disabled="true" />
        <mk-dropdown-item label="С иконкой">
          <template #prefixIcon><MkDateRangeIcon /></template>
        </mk-dropdown-item>
        <mk-dropdown-item label="С суффиксом">
          <template #suffix><span>⌘S</span></template>
        </mk-dropdown-item>
        <mk-dropdown-item label="Всё вместе" :active="true">
          <template #prefixIcon><MkDoneIcon /></template>
          <template #suffix><span>✓</span></template>
        </mk-dropdown-item>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-dropdown-item',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toBeInTheDocument();
  },
};

export const RendersAsDiv: Story = {
  name: 'Test: рендерится как <div>',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root?.tagName.toLowerCase()).toBe('div');
  },
};

export const HasRoleOption: Story = {
  name: 'Test: имеет role="option"',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toHaveAttribute('role', 'option');
  },
};

export const HasTextElement: Story = {
  name: 'Test: содержит .mk-dropdown-item__text',
  args: { label: 'Текст' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-dropdown-item__text');
    await expect(text).toBeInTheDocument();
    await expect(text).toHaveTextContent('Текст');
  },
};

// ─────────────────────────────────────────────
// Классы состояний
// ─────────────────────────────────────────────

export const NoActiveClassByDefault: Story = {
  name: 'Test: нет --active без пропса',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).not.toHaveClass('mk-dropdown-item--active');
  },
};

export const ActiveClass: Story = {
  name: 'Test: active добавляет класс mk-dropdown-item--active',
  args: { label: 'Пункт', active: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toHaveClass('mk-dropdown-item--active');
  },
};

export const NoDisabledClassByDefault: Story = {
  name: 'Test: нет --disabled без пропса',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).not.toHaveClass('mk-dropdown-item--disabled');
  },
};

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-dropdown-item--disabled',
  args: { label: 'Пункт', disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toHaveClass('mk-dropdown-item--disabled');
  },
};

// ─────────────────────────────────────────────
// ARIA
// ─────────────────────────────────────────────

export const AriaSelectedWhenActive: Story = {
  name: 'Test: aria-selected=true когда active',
  args: { label: 'Пункт', active: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toHaveAttribute('aria-selected', 'true');
  },
};

export const AriaNotSelectedByDefault: Story = {
  name: 'Test: aria-selected=false по умолчанию',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toHaveAttribute('aria-selected', 'false');
  },
};

export const AriaDisabledWhenDisabled: Story = {
  name: 'Test: aria-disabled=true когда disabled',
  args: { label: 'Пункт', disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toHaveAttribute('aria-disabled', 'true');
  },
};

export const AriaNotDisabledByDefault: Story = {
  name: 'Test: aria-disabled=false по умолчанию',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item');
    await expect(root).toHaveAttribute('aria-disabled', 'false');
  },
};

// ─────────────────────────────────────────────
// PrefixIcon
// ─────────────────────────────────────────────

export const NoIconByDefault: Story = {
  name: 'Test: нет .mk-dropdown-item__icon без иконки',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-dropdown-item__icon');
    await expect(icon).not.toBeInTheDocument();
  },
};

export const IconViaSlot: Story = {
  name: 'Test: prefixIcon рендерится через слот',
  render: () => ({
    components: { MkDropdownItem, MkDateRangeIcon },
    template: `<mk-dropdown-item label="Дата"><template #prefixIcon><MkDateRangeIcon /></template></mk-dropdown-item>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-dropdown-item__icon');
    await expect(icon).toBeInTheDocument();
  },
};

export const IconViaProp: Story = {
  name: 'Test: prefixIcon рендерится через пропс',
  render: () => ({
    components: { MkDropdownItem },
    setup() {
      return { MkDateRangeIcon: markRaw(MkDateRangeIcon) };
    },
    template: `<mk-dropdown-item label="Дата" :icon="MkDateRangeIcon" />`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-dropdown-item__icon');
    await expect(icon).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Suffix
// ─────────────────────────────────────────────

export const NoSuffixByDefault: Story = {
  name: 'Test: нет .mk-dropdown-item__suffix без слота',
  args: { label: 'Пункт' },
  play: async ({ canvasElement }) => {
    const suffix = canvasElement.querySelector('.mk-dropdown-item__suffix');
    await expect(suffix).not.toBeInTheDocument();
  },
};

export const SuffixRenders: Story = {
  name: 'Test: suffix рендерится через слот',
  render: () => ({
    components: { MkDropdownItem },
    template: `<mk-dropdown-item label="Сохранить"><template #suffix><span>⌘S</span></template></mk-dropdown-item>`,
  }),
  play: async ({ canvasElement }) => {
    const suffix = canvasElement.querySelector('.mk-dropdown-item__suffix');
    await expect(suffix).toBeInTheDocument();
    await expect(suffix).toHaveTextContent('⌘S');
  },
};

// ─────────────────────────────────────────────
// Default slot
// ─────────────────────────────────────────────

export const DefaultSlotOverridesLabel: Story = {
  name: 'Test: default slot заменяет label',
  render: () => ({
    components: { MkDropdownItem },
    template: `<mk-dropdown-item label="Label"><template #default><strong>Custom</strong></template></mk-dropdown-item>`,
  }),
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-dropdown-item__text');
    await expect(text).toHaveTextContent('Custom');
    await expect(text).not.toHaveTextContent('Label');
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsClick: Story = {
  name: 'Test: эмитит click по клику',
  args: { label: 'Пункт', onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item') as HTMLElement;
    await userEvent.click(root);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const NoClickWhenDisabled: Story = {
  name: 'Test: не эмитит click если disabled',
  args: { label: 'Пункт', disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const root = canvasElement.querySelector('.mk-dropdown-item') as HTMLElement;
    await userEvent.click(root);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
