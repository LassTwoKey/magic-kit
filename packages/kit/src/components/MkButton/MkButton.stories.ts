import { MkDoneIcon } from '@magic/kit/icons';
import { expect, fn, userEvent } from 'storybook/test';

import MkButton from './MkButton.vue';

import type { Variant, Size, IconSide } from '@magic/kit/types';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkButton. Включает визуальные примеры, тесты классов и структуры DOM, рендеринга label и иконки, работы пропса as, disabled состояния, ARIA атрибутов и событий.
 */
const meta = {
  title: 'Components/MkButton',
  component: MkButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'] satisfies Variant[],
    },
    label: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['lg', 'sm'] satisfies Size[],
    },
    icon: {
      control: 'text',
    },
    iconSide: {
      control: 'select',
      options: ['right', 'left'] satisfies IconSide[],
    },
    as: {
      control: 'select',
      options: ['a', 'button'],
    },
    outline: {
      control: 'boolean',
    },
    text: {
      control: 'boolean',
    },
    thin: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    ariaLabel: {
      control: 'text',
    },
    ariaLabelledby: {
      control: 'text',
    },
    title: {
      control: 'text',
    },
  },
} satisfies Meta<typeof MkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Secondary: Story = {
  args: { label: 'Кнопка' },
};

export const Primary: Story = {
  args: { label: 'Кнопка', variant: 'primary' },
};

export const Danger: Story = {
  args: { label: 'Кнопка', variant: 'danger' },
};

export const Disabled: Story = {
  args: { label: 'Кнопка', disabled: true },
};

export const WithIcon: Story = {
  args: { label: 'Кнопка', variant: 'primary' },
  render: (args) => ({
    components: { MkButton, MkDoneIcon },
    setup() {
      return { args };
    },
    template: `<mk-button v-bind="args"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    components: { MkButton, MkDoneIcon },
    template: `<mk-button aria-label="Действие"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
};

// ─────────────────────────────────────────────
// Классы и структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-button',
  args: { label: 'Кнопка' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button');
  },
};

export const DefaultVariantClass: Story = {
  name: 'Test: вариант secondary по умолчанию',
  args: { label: 'Кнопка' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--secondary');
  },
};

export const PrimaryVariantClass: Story = {
  name: 'Test: вариант primary',
  args: { label: 'Кнопка', variant: 'primary' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--primary');
  },
};

export const DangerVariantClass: Story = {
  name: 'Test: вариант danger',
  args: { label: 'Кнопка', variant: 'danger' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--danger');
  },
};

export const OutlineClass: Story = {
  name: 'Test: outline добавляет класс',
  args: { label: 'Кнопка', outline: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--outline');
  },
};

export const TextClass: Story = {
  name: 'Test: text добавляет класс',
  args: { label: 'Кнопка', text: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--text');
  },
};

export const ThinClass: Story = {
  name: 'Test: thin добавляет класс',
  args: { label: 'Кнопка', text: true, thin: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--thin');
  },
};

export const SizeSmClass: Story = {
  name: 'Test: size sm добавляет класс',
  args: { label: 'Кнопка', text: true, size: 'sm' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--size-sm');
  },
};

export const SizeLgClass: Story = {
  name: 'Test: size lg добавляет класс',
  args: { label: 'Кнопка', text: true, size: 'lg' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toHaveClass('mk-button--size-lg');
  },
};

// ─────────────────────────────────────────────
// Label
// ─────────────────────────────────────────────

export const RendersLabel: Story = {
  name: 'Test: рендерит текст label',
  args: { label: 'Сохранить' },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Сохранить', { selector: '.mk-button__label' });
    await expect(label).toHaveTextContent('Сохранить');
  },
};

export const NoLabelElement: Story = {
  name: 'Test: нет .mk-button__label без пропса label',
  args: {},
  render: (args) => ({
    components: { MkButton, MkDoneIcon },
    setup() {
      return { args };
    },
    template: `<mk-button v-bind="args" aria-label="icon only"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('.mk-button__label');
    await expect(label).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Иконка
// ─────────────────────────────────────────────

export const RendersIcon: Story = {
  name: 'Test: рендерит иконку через слот',
  args: { label: 'Кнопка' },
  render: (args) => ({
    components: { MkButton, MkDoneIcon },
    setup() {
      return { args };
    },
    template: `<mk-button v-bind="args"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-button__icon');
    await expect(icon).toBeInTheDocument();
  },
};

export const IconOnlyClass: Story = {
  name: 'Test: icon-only класс без label',
  render: () => ({
    components: { MkButton, MkDoneIcon },
    template: `<mk-button aria-label="Удалить"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-button');
    await expect(button).toHaveClass('mk-button--icon-only');
  },
};

export const NoIconOnlyClassWithLabel: Story = {
  name: 'Test: нет icon-only если есть label',
  args: { label: 'Кнопка' },
  render: (args) => ({
    components: { MkButton, MkDoneIcon },
    setup() {
      return { args };
    },
    template: `<mk-button v-bind="args"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-button');
    await expect(button).not.toHaveClass('mk-button--icon-only');
  },
};

export const IconSideRight: Story = {
  name: 'Test: iconSide right добавляет класс на иконку',
  args: { label: 'Кнопка', iconSide: 'right' },
  render: (args) => ({
    components: { MkButton, MkDoneIcon },
    setup() {
      return { args };
    },
    template: `<mk-button v-bind="args"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-button__icon');
    await expect(icon).toHaveClass('mk-button__icon--side-right');
  },
};

export const IconSideLeft: Story = {
  name: 'Test: iconSide left добавляет класс на иконку',
  args: { label: 'Кнопка', iconSide: 'left' },
  render: (args) => ({
    components: { MkButton, MkDoneIcon },
    setup() {
      return { args };
    },
    template: `<mk-button v-bind="args"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-button__icon');
    await expect(icon).toHaveClass('mk-button__icon--side-left');
  },
};

// ─────────────────────────────────────────────
// Тег as
// ─────────────────────────────────────────────

export const RendersAsAnchor: Story = {
  name: 'Test: рендерит <a> при as="a"',
  args: { label: 'Ссылка', as: 'a' },
  play: async ({ canvasElement }) => {
    const anchor = canvasElement.querySelector('a.mk-button');
    await expect(anchor).toBeInTheDocument();
  },
};

export const RendersAsButton: Story = {
  name: 'Test: рендерит <button> по умолчанию',
  args: { label: 'Кнопка' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button.tagName.toLowerCase()).toBe('button');
  },
};

// ─────────────────────────────────────────────
// Disabled
// ─────────────────────────────────────────────

export const DisabledState: Story = {
  name: 'Test: disabled блокирует кнопку',
  args: { label: 'Кнопка', disabled: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).toBeDisabled();
  },
};

export const NotDisabledByDefault: Story = {
  name: 'Test: кнопка активна по умолчанию',
  args: { label: 'Кнопка' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await expect(button).not.toBeDisabled();
  },
};

// ─────────────────────────────────────────────
// ARIA / доступность
// ─────────────────────────────────────────────

export const AriaLabel: Story = {
  name: 'Test: устанавливает aria-label',
  args: { ariaLabel: 'Удалить запись' },
  render: (args) => ({
    components: { MkButton, MkDoneIcon },
    setup() {
      return { args };
    },
    template: `<mk-button v-bind="args"><template #icon><MkDoneIcon /></template></mk-button>`,
  }),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Удалить запись' });
    await expect(button).toHaveAttribute('aria-label', 'Удалить запись');
  },
};

export const AriaLabelledby: Story = {
  name: 'Test: устанавливает aria-labelledby',
  args: { label: 'Кнопка', ariaLabelledby: 'heading-id' },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-button');
    await expect(button).toHaveAttribute('aria-labelledby', 'heading-id');
  },
};

export const TitleAttr: Story = {
  name: 'Test: устанавливает title',
  args: { label: 'Кнопка', title: 'Подсказка' },
  play: async ({ canvas }) => {
    const button = canvas.getByTitle('Подсказка');
    await expect(button).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsClick: Story = {
  name: 'Test: эмитит click по клику',
  args: { label: 'Кнопка', onClick: fn() },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const NoClickWhenDisabled: Story = {
  name: 'Test: не эмитит click если disabled',
  args: { label: 'Кнопка', disabled: true, onClick: fn() },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const EmitsFocus: Story = {
  name: 'Test: эмитит focus',
  args: { label: 'Кнопка', onFocus: fn() },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    button.focus();
    await expect(args.onFocus).toHaveBeenCalledTimes(1);
  },
};

export const EmitsBlur: Story = {
  name: 'Test: эмитит blur',
  args: { label: 'Кнопка', onBlur: fn() },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Кнопка' });
    await userEvent.click(button);
    await userEvent.tab();
    await expect(args.onBlur).toHaveBeenCalledTimes(1);
  },
};
