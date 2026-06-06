import { expect } from 'storybook/test';

import MkDivider from './MkDivider.vue';
import type { Direction } from './types';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkDivider. Включает визуальные примеры и тесты классов, role, дефолтного значения и direction пропса.
 */
const meta = {
  title: 'Components/MkDivider',
  component: MkDivider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'] satisfies Direction[],
      table: { defaultValue: { summary: 'horizontal' } },
    },
  },
} satisfies Meta<typeof MkDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkDivider },
    setup() {
      return { args };
    },
    template: `
      <div v-if="args.direction === 'vertical'" class="d-flex ga-3">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda sapiente eum, omnis
          inventore dicta deserunt accusantium qui dolores, perspiciatis fuga, quisquam ut provident?
          Cupiditate molestiae repellat dignissimos architecto rem beatae?
        </p>
        <mk-divider v-bind="args" class="h-auto" />
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda sapiente eum, omnis
          inventore dicta deserunt accusantium qui dolores, perspiciatis fuga, quisquam ut provident?
          Cupiditate molestiae repellat dignissimos architecto rem beatae?
        </p>
      </div>

      <div v-else style="width: 480px;">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda sapiente eum, omnis
          inventore dicta deserunt accusantium qui dolores, perspiciatis fuga, quisquam ut provident?
          Cupiditate molestiae repellat dignissimos architecto rem beatae?
        </p>
        <mk-divider v-bind="args" class="mt-3 mb-3" />
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Assumenda sapiente eum, omnis
          inventore dicta deserunt accusantium qui dolores, perspiciatis fuga, quisquam ut provident?
          Cupiditate molestiae repellat dignissimos architecto rem beatae?
        </p>
      </div>
    `,
  }),
};

export const Horizontal: Story = {
  name: 'Horizontal (default)',
  render: () => ({
    components: { MkDivider },
    template: `
      <div style="width: 320px;">
        <p>Первый блок контента</p>
        <mk-divider class="mt-3 mb-3" />
        <p>Второй блок контента</p>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  args: { direction: 'vertical' },
  render: (args) => ({
    components: { MkDivider },
    setup() {
      return { args };
    },
    template: `
      <div class="d-flex align-center ga-3">
        <span>Слева</span>
        <mk-divider v-bind="args" class="h-auto" />
        <span>Справа</span>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-divider',
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-divider');
    await expect(divider).toBeInTheDocument();
  },
};

export const HasRoleSeparator: Story = {
  name: 'Test: имеет role="separator"',
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('[role="separator"]');
    await expect(divider).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Direction пропс
// ─────────────────────────────────────────────

export const DefaultIsHorizontal: Story = {
  name: 'Test: без direction добавляет класс mk-divider--horizontal',
  args: {},
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-divider');
    await expect(divider).toHaveClass('mk-divider--horizontal');
  },
};

export const HorizontalClass: Story = {
  name: 'Test: direction horizontal добавляет класс mk-divider--horizontal',
  args: { direction: 'horizontal' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-divider');
    await expect(divider).toHaveClass('mk-divider--horizontal');
  },
};

export const HorizontalNoVerticalClass: Story = {
  name: 'Test: direction horizontal не добавляет класс mk-divider--vertical',
  args: { direction: 'horizontal' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-divider');
    await expect(divider).not.toHaveClass('mk-divider--vertical');
  },
};

export const VerticalClass: Story = {
  name: 'Test: direction vertical добавляет класс mk-divider--vertical',
  args: { direction: 'vertical' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-divider');
    await expect(divider).toHaveClass('mk-divider--vertical');
  },
};

export const VerticalNoHorizontalClass: Story = {
  name: 'Test: direction vertical не добавляет класс mk-divider--horizontal',
  args: { direction: 'vertical' },
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-divider');
    await expect(divider).not.toHaveClass('mk-divider--horizontal');
  },
};
