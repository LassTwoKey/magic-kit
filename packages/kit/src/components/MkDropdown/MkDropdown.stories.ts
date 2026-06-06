import { ref } from 'vue';
import { MkDateRangeIcon } from '@magic/kit/icons';
import { expect, fn, userEvent } from 'storybook/test';

import type { DropdownItem } from './api';
import MkDropdown from './MkDropdown.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

const FRUITS: DropdownItem[] = [
  { label: 'Яблоко', value: 'apple' },
  { label: 'Банан', value: 'banana' },
  { label: 'Апельсин', value: 'orange' },
  { label: 'Виноград', value: 'grape' },
  { label: 'Манго', value: 'mango' },
];

const FRUITS_WITH_DISABLED: DropdownItem[] = [
  { label: 'Яблоко', value: 'apple' },
  { label: 'Банан', value: 'banana', disabled: true },
  { label: 'Апельсин', value: 'orange' },
];

/**
 * Истории для MkDropdown. Включает визуальные примеры и тесты структуры DOM,
 * классов, взаимодействия и событий.
 */
const meta = {
  title: 'Components/Dropdown/MkDropdown',
  component: MkDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    error: { control: 'text' },
    loading: { control: 'boolean' },
    size: {
      control: 'select',
      options: [null, 'sm'],
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom', 'top-start', 'top'],
    },
  },
} satisfies Meta<typeof MkDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: { placeholder: 'Выберите...', items: FRUITS },
  render: (args) => ({
    components: { MkDropdown },
    setup() {
      const val = ref('');
      return { args, val };
    },
    template: `<mk-dropdown v-model="val" v-bind="args" style="width: 300px" />`,
  }),
};

export const Default: Story = {
  render: () => ({
    components: { MkDropdown },
    setup() {
      const val = ref('');
      return { val, items: FRUITS };
    },
    template: `<mk-dropdown v-model="val" :items="items" placeholder="Выберите фрукт..." style="width: 240px" />`,
  }),
};

export const Preselected: Story = {
  render: () => ({
    components: { MkDropdown },
    setup() {
      const val = ref('banana');
      return { val, items: FRUITS };
    },
    template: `<mk-dropdown v-model="val" :items="items" placeholder="Выберите фрукт..." style="width: 240px" />`,
  }),
};

export const Disabled: Story = {
  args: { items: FRUITS, disabled: true, placeholder: 'Заблокирован' },
};

export const Loading: Story = {
  args: { items: FRUITS, loading: true, placeholder: 'Загрузка...' },
};

export const WithError: Story = {
  args: {
    items: FRUITS,
    invalid: true,
    error: 'Обязательное поле',
    placeholder: 'Выберите...',
  },
};

export const SizeSm: Story = {
  args: { items: FRUITS, size: 'sm', placeholder: 'Маленький' },
};

export const WithDisabledItem: Story = {
  render: () => ({
    components: { MkDropdown },
    setup() {
      const val = ref('');
      return { val, items: FRUITS_WITH_DISABLED };
    },
    template: `<mk-dropdown v-model="val" :items="items" placeholder="Выберите..." style="width: 240px" />`,
  }),
};

export const WithPrefixIcon: Story = {
  name: 'Prefix icon',
  render: () => ({
    components: { MkDropdown, MkDateRangeIcon },
    setup() {
      const val = ref('');
      return { val, items: FRUITS };
    },
    template: `<mk-dropdown v-model="val" :items="items" placeholder="Выберите..." style="width: 240px"><template #prefixIcon><MkDateRangeIcon /></template></mk-dropdown>`,
  }),
};

export const CustomItems: Story = {
  name: 'Custom items (slot)',
  render: () => ({
    components: { MkDropdown },
    setup() {
      const val = ref('');
      return { val };
    },
    template: `
      <mk-dropdown v-model="val" placeholder="Выберите..." style="width: 240px">
        <div style="padding: 4px 12px; font-weight: 600; color: #666; font-size: 11px">Фрукты</div>
        <span style="display: block; height: 1px; background: #eee; margin: 4px 0" />
      </mk-dropdown>
    `,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    components: { MkDropdown },
    setup() {
      const a = ref('');
      const b = ref('banana');
      const c = ref('');
      return { a, b, c, items: FRUITS, itemsDisabled: FRUITS_WITH_DISABLED };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 280px">
        <mk-dropdown v-model="a" :items="items" placeholder="Default" />
        <mk-dropdown v-model="b" :items="items" placeholder="Preselected" />
        <mk-dropdown :items="items" disabled placeholder="Disabled" />
        <mk-dropdown :items="items" :loading="true" placeholder="Loading" />
        <mk-dropdown :items="items" :invalid="true" error="Ошибка" placeholder="Error" />
        <mk-dropdown v-model="c" :items="itemsDisabled" placeholder="Disabled item" size="sm" />
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-dropdown',
  args: { items: FRUITS },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown');
    await expect(root).toBeInTheDocument();
  },
};

export const HasInputDropdown: Story = {
  name: 'Test: содержит MkInputDropdown',
  args: { items: FRUITS, placeholder: 'Выберите...' },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner');
    await expect(inner).toBeInTheDocument();
  },
};

export const DisplaysPlaceholder: Story = {
  name: 'Test: отображает placeholder',
  args: { items: FRUITS, placeholder: 'Выберите фрукт...' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Выберите фрукт...');
  },
};

export const DisplaysSelectedLabel: Story = {
  name: 'Test: отображает label выбранного пункта',
  args: { items: FRUITS, modelValue: 'banana' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Банан');
  },
};

// ─────────────────────────────────────────────
// Классы состояний
// ─────────────────────────────────────────────

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-dropdown--disabled',
  args: { items: FRUITS, disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown');
    await expect(root).toHaveClass('mk-dropdown--disabled');
  },
};

export const InvalidClass: Story = {
  name: 'Test: invalid добавляет класс mk-dropdown--invalid',
  args: { items: FRUITS, invalid: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown');
    await expect(root).toHaveClass('mk-dropdown--invalid');
  },
};

export const SizeSmClass: Story = {
  name: 'Test: size sm добавляет класс mk-dropdown--sm',
  args: { items: FRUITS, size: 'sm' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-dropdown');
    await expect(root).toHaveClass('mk-dropdown--sm');
  },
};

// ─────────────────────────────────────────────
// Error
// ─────────────────────────────────────────────

export const ErrorRenders: Story = {
  name: 'Test: error рендерит текст ошибки',
  args: { items: FRUITS, invalid: true, error: 'Обязательное поле' },
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-input-dropdown__error');
    await expect(error).toBeInTheDocument();
    await expect(error).toHaveTextContent('Обязательное поле');
  },
};

export const NoErrorByDefault: Story = {
  name: 'Test: нет ошибки без пропса',
  args: { items: FRUITS },
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-input-dropdown__error');
    await expect(error).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Стрелка / Preloader
// ─────────────────────────────────────────────

export const ArrowPresent: Story = {
  name: 'Test: стрелка присутствует по умолчанию',
  args: { items: FRUITS },
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-input-dropdown__arrow');
    await expect(arrow).toBeInTheDocument();
  },
};

export const LoadingShowsPreloader: Story = {
  name: 'Test: loading показывает preloader',
  args: { items: FRUITS, loading: true },
  play: async ({ canvasElement }) => {
    const preloader = canvasElement.querySelector('.mk-input-dropdown__preloader');
    await expect(preloader).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при выборе',
  render: () => ({
    components: { MkDropdown },
    setup() {
      const val = ref('');
      const onUpdate = fn();
      return { val, items: FRUITS, onUpdate };
    },
    template: `<mk-dropdown v-model="val" :items="items" placeholder="Выберите..." style="width: 240px" @update:modelValue="onUpdate" />`,
  }),
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner') as HTMLElement;
    await userEvent.click(inner);
    // Панель может быть телепортирована — ищем в document
    const items = document.querySelectorAll('.mk-dropdown__panel .mk-dropdown-item');
    await expect(items.length).toBeGreaterThan(0);
    await userEvent.click(items[0]);
    // Проверяем что значение обновилось
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Яблоко');
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при выборе',
  args: { onChange: fn() },
  render: (args) => ({
    components: { MkDropdown },
    setup() {
      const val = ref('');
      return { val, items: FRUITS, args };
    },
    template: `<mk-dropdown v-model="val" :items="items" placeholder="Выберите..." style="width: 240px" @change="args.onChange" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner') as HTMLElement;
    await userEvent.click(inner);
    const items = document.querySelectorAll('.mk-dropdown__panel .mk-dropdown-item');
    await userEvent.click(items[1]);
    await expect(args.onChange).toHaveBeenCalledWith('banana');
  },
};

export const NoClickWhenDisabled: Story = {
  name: 'Test: не открывается при disabled',
  args: { items: FRUITS, disabled: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner') as HTMLElement;
    await userEvent.click(inner);
    const panel = document.querySelector('.mk-dropdown__panel');
    await expect(panel).not.toBeInTheDocument();
  },
};
