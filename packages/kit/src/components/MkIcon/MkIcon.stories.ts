import { MkAccountCircleIcon, MkDoneIcon, MkWarningIcon } from '@magic/kit/icons';
import { expect } from 'storybook/test';

import MkIcon from './MkIcon.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkIcon. Включает визуальные примеры, тесты классов и структуры DOM,
 * применения size/color стилей, рендеринга icon пропса и слота.
 */
const meta = {
  title: 'Components/MkIcon',
  component: MkIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: {
      control: false,
      table: { type: { summary: 'Component | string' } },
    },
    size: {
      control: 'text',
      table: { type: { summary: 'number | string' }, defaultValue: { summary: 'inherit' } },
    },
    color: {
      control: 'color',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'inherit' } },
    },
  },
} satisfies Meta<typeof MkIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkIcon, MkAccountCircleIcon },
    setup() {
      return { args };
    },
    template: `
      <mk-icon v-bind="args">
        <MkAccountCircleIcon />
      </mk-icon>
    `,
  }),
};

export const Default: Story = {
  name: 'Default (slot)',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon><MkAccountCircleIcon /></mk-icon>`,
  }),
};

export const WithIconProp: Story = {
  name: 'With icon prop',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    setup() {
      return { icon: MkAccountCircleIcon };
    },
    template: `<mk-icon :icon="icon" />`,
  }),
};

export const SizeNumber: Story = {
  name: 'Size — number (px)',
  args: { size: 48 },
  render: (args) => ({
    components: { MkIcon, MkAccountCircleIcon },
    setup() {
      return { args };
    },
    template: `<mk-icon :size="args.size"><MkAccountCircleIcon /></mk-icon>`,
  }),
};

export const SizeString: Story = {
  name: 'Size — string (em)',
  args: { size: '3em' },
  render: (args) => ({
    components: { MkIcon, MkAccountCircleIcon },
    setup() {
      return { args };
    },
    template: `<mk-icon :size="args.size"><MkAccountCircleIcon /></mk-icon>`,
  }),
};

export const WithColor: Story = {
  name: 'With color',
  args: { color: '#e53935' },
  render: (args) => ({
    components: { MkIcon, MkWarningIcon },
    setup() {
      return { args };
    },
    template: `<mk-icon :color="args.color"><MkWarningIcon /></mk-icon>`,
  }),
};

export const SizeVariants: Story = {
  name: 'Size Variants',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `
      <div class="d-flex align-center ga-4">
        <mk-icon :size="16"><MkAccountCircleIcon /></mk-icon>
        <mk-icon :size="24"><MkAccountCircleIcon /></mk-icon>
        <mk-icon :size="32"><MkAccountCircleIcon /></mk-icon>
        <mk-icon :size="48"><MkAccountCircleIcon /></mk-icon>
        <mk-icon size="4em"><MkAccountCircleIcon /></mk-icon>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-icon',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-icon');
    await expect(icon).toBeInTheDocument();
  },
};

export const IsIElement: Story = {
  name: 'Test: корневой элемент — <i>',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('i.mk-icon');
    await expect(icon).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Слот и icon пропс
// ─────────────────────────────────────────────

export const RendersSlotContent: Story = {
  name: 'Test: рендерит svg из slot',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toBeInTheDocument();
  },
};

export const RendersIconProp: Story = {
  name: 'Test: рендерит svg из icon пропса',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    setup() {
      return { icon: MkAccountCircleIcon };
    },
    template: `<mk-icon :icon="icon" />`,
  }),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).toBeInTheDocument();
  },
};

export const IconPropOverridesSlot: Story = {
  name: 'Test: icon пропс имеет приоритет над slot',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon, MkDoneIcon },
    setup() {
      return { icon: MkAccountCircleIcon };
    },
    template: `<mk-icon :icon="icon"><MkDoneIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg');
    await expect(svgs).toHaveLength(1);
  },
};

export const NoSvgWithoutIconOrSlot: Story = {
  name: 'Test: без icon и slot svg не рендерится',
  args: {},
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    await expect(svg).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Стили
// ─────────────────────────────────────────────

export const SizeNumberAppliesPx: Story = {
  name: 'Test: size number применяет font-size в px',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon :size="32"><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-icon') as HTMLElement;
    await expect(icon).toHaveStyle({ fontSize: '32px' });
  },
};

export const SizeStringUsedAsIs: Story = {
  name: 'Test: size string применяет font-size без изменений',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon size="2em"><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-icon') as HTMLElement;
    await expect(icon).toHaveStyle({ fontSize: '26px' }); // 2em × 13px = 26px
  },
};

export const NoFontSizeWithoutSize: Story = {
  name: 'Test: без size prop нет inline font-size',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-icon') as HTMLElement;
    await expect(icon.style.fontSize).toBe('');
  },
};

export const ColorApplied: Story = {
  name: 'Test: color применяет inline color стиль',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon color="rgb(229, 57, 53)"><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-icon') as HTMLElement;
    await expect(icon).toHaveStyle({ color: 'rgb(229, 57, 53)' });
  },
};

export const NoColorWithoutProp: Story = {
  name: 'Test: без color prop нет inline color стиля',
  render: () => ({
    components: { MkIcon, MkAccountCircleIcon },
    template: `<mk-icon><MkAccountCircleIcon /></mk-icon>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-icon') as HTMLElement;
    await expect(icon.style.color).toBe('');
  },
};
