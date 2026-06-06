import { ref } from 'vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkCheckbox from './MkCheckbox.vue';

import type { Size } from '@magic/kit/types';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkCheckbox. Включает визуальные примеры, тесты классов и структуры DOM, рендеринга label/description/tooltip, атрибутов input и событий.
 */
const meta = {
  title: 'Components/MkCheckbox',
  component: MkCheckbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    indeterminate: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'lg'] satisfies Size[],
    },
    tabindex: { control: 'number' },
    modelValue: {
      table: { type: { summary: 'ModelValue' } },
      control: { type: 'boolean' },
    },
    label: { control: 'text' },
    description: { control: 'text' },
    tooltip: { control: 'text' },
    value: {
      table: { type: { summary: 'ModelValue' } },
      control: { type: 'boolean' },
    },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    name: { control: 'text' },
    trueValue: {
      control: 'text',
      table: { defaultValue: { summary: 'true' } },
    },
    falseValue: {
      control: 'text',
      table: { defaultValue: { summary: 'false' } },
    },
    id: { control: 'text' },
  },
} satisfies Meta<typeof MkCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: { label: 'Checkbox' },
  render: (args) => ({
    components: { MkCheckbox },
    setup() {
      const state = ref(false);
      return { args, state };
    },
    template: `<mk-checkbox v-model="state" v-bind="args" />`,
  }),
};

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { modelValue: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const WithLabel: Story = {
  args: { label: 'Согласен с условиями' },
};

export const WithDescription: Story = {
  args: { label: 'Уведомления', description: 'Получать уведомления на почту' },
};

export const WithTooltip: Story = {
  args: { label: 'Опция', tooltip: 'Дополнительная информация' },
};

export const SizeSm: Story = {
  args: { label: 'Маленький', size: 'sm' },
};

export const Disabled: Story = {
  args: { label: 'Заблокирован', disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Заблокирован и отмечен', disabled: true, modelValue: true },
};

export const SizeVariants: Story = {
  name: 'Size Variants',
  render: () => ({
    components: { MkCheckbox },
    setup() {
      const state = ref(false);
      const stateSmall = ref(false);
      return { state, stateSmall };
    },
    template: `
      <div class="d-flex justify-center align-center ga-4">
        <mk-checkbox v-model="state" label="Default" />
        <mk-checkbox v-model="stateSmall" label="Small" size="sm" />
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Классы и структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-checkbox',
  args: { label: 'Чекбокс' },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('.mk-checkbox');
    await expect(checkbox).toBeInTheDocument();
  },
};

export const CheckedClass: Story = {
  name: 'Test: modelValue true добавляет класс mk-checkbox--checked',
  args: { label: 'Чекбокс', modelValue: true },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('.mk-checkbox');
    await expect(checkbox).toHaveClass('mk-checkbox--checked');
  },
};

export const UncheckedNoCheckedClass: Story = {
  name: 'Test: modelValue false не добавляет класс mk-checkbox--checked',
  args: { label: 'Чекбокс', modelValue: false },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('.mk-checkbox');
    await expect(checkbox).not.toHaveClass('mk-checkbox--checked');
  },
};

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-checkbox--disabled',
  args: { label: 'Чекбокс', disabled: true },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('.mk-checkbox');
    await expect(checkbox).toHaveClass('mk-checkbox--disabled');
  },
};

export const IndeterminateClass: Story = {
  name: 'Test: indeterminate добавляет класс mk-checkbox--indeterminate',
  args: { label: 'Чекбокс', indeterminate: true },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('.mk-checkbox');
    await expect(checkbox).toHaveClass('mk-checkbox--indeterminate');
  },
};

export const SizeSmClass: Story = {
  name: 'Test: size sm добавляет класс mk-checkbox--sm',
  args: { label: 'Чекбокс', size: 'sm' },
  play: async ({ canvasElement }) => {
    const checkbox = canvasElement.querySelector('.mk-checkbox');
    await expect(checkbox).toHaveClass('mk-checkbox--sm');
  },
};

export const InnerCheckedClass: Story = {
  name: 'Test: inner получает класс mk-checkbox__inner--checked',
  args: { modelValue: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-checkbox__inner');
    await expect(inner).toHaveClass('mk-checkbox__inner--checked');
  },
};

export const InnerDisabledClass: Story = {
  name: 'Test: inner получает класс mk-checkbox__inner--disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-checkbox__inner');
    await expect(inner).toHaveClass('mk-checkbox__inner--disabled');
  },
};

export const InnerIndeterminateClass: Story = {
  name: 'Test: inner получает класс mk-checkbox__inner--indeterminate',
  args: { indeterminate: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-checkbox__inner');
    await expect(inner).toHaveClass('mk-checkbox__inner--indeterminate');
  },
};

export const InnerSizeSmClass: Story = {
  name: 'Test: inner получает класс mk-checkbox__inner--sm',
  args: { size: 'sm' },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-checkbox__inner');
    await expect(inner).toHaveClass('mk-checkbox__inner--sm');
  },
};

// ─────────────────────────────────────────────
// Label, description, tooltip
// ─────────────────────────────────────────────

export const RendersLabel: Story = {
  name: 'Test: рендерит текст label',
  args: { label: 'Принять условия' },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Принять условия', { selector: '.mk-checkbox__label' });
    await expect(label).toHaveTextContent('Принять условия');
  },
};

export const NoContentWithoutLabel: Story = {
  name: 'Test: нет .mk-checkbox__content без label',
  args: {},
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-checkbox__content');
    await expect(content).not.toBeInTheDocument();
  },
};

export const RendersDescription: Story = {
  name: 'Test: рендерит description',
  args: { label: 'Опция', description: 'Описание опции' },
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-checkbox__description');
    await expect(desc).toBeInTheDocument();
    await expect(desc).toHaveTextContent('Описание опции');
  },
};

export const NoDescriptionWithoutProp: Story = {
  name: 'Test: нет .mk-checkbox__description без пропса',
  args: { label: 'Опция' },
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-checkbox__description');
    await expect(desc).not.toBeInTheDocument();
  },
};

export const RendersTooltipIcon: Story = {
  name: 'Test: рендерит tooltip-иконку при наличии пропса tooltip',
  args: { label: 'Опция', tooltip: 'Подсказка' },
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('.mk-checkbox__tooltip');
    await expect(tooltip).toBeInTheDocument();
  },
};

export const NoTooltipWithoutProp: Story = {
  name: 'Test: нет .mk-checkbox__tooltip без пропса tooltip',
  args: { label: 'Опция' },
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('.mk-checkbox__tooltip');
    await expect(tooltip).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Input атрибуты
// ─────────────────────────────────────────────

export const InputTypeCheckbox: Story = {
  name: 'Test: input имеет type="checkbox"',
  args: { label: 'Чекбокс' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('type', 'checkbox');
  },
};

export const InputName: Story = {
  name: 'Test: input имеет атрибут name',
  args: { label: 'Чекбокс', name: 'agreement' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('name', 'agreement');
  },
};

export const InputId: Story = {
  name: 'Test: input имеет атрибут id',
  args: { label: 'Чекбокс', id: 'cb-id' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('id', 'cb-id');
  },
};

export const InputDisabled: Story = {
  name: 'Test: input заблокирован при disabled',
  args: { label: 'Чекбокс', disabled: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeDisabled();
  },
};

export const InputNotDisabledByDefault: Story = {
  name: 'Test: input активен по умолчанию',
  args: { label: 'Чекбокс' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeDisabled();
  },
};

// ─────────────────────────────────────────────
// Состояния
// ─────────────────────────────────────────────

export const ModelValueTrue: Story = {
  name: 'Test: modelValue=true — input отмечен',
  args: { modelValue: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input).toBeChecked();
  },
};

export const ModelValueFalse: Story = {
  name: 'Test: modelValue=false — input не отмечен',
  args: { modelValue: false },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input).not.toBeChecked();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsChange: Story = {
  name: 'Test: эмитит change при клике',
  args: { label: 'Чекбокс', onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const EmitsChangeWithValue: Story = {
  name: 'Test: change передаёт true при отметке',
  args: { label: 'Чекбокс', onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(args.onChange).toHaveBeenCalledWith(true, expect.anything());
  },
};

export const NoChangeWhenDisabled: Story = {
  name: 'Test: не эмитит change если disabled',
  args: { label: 'Чекбокс', disabled: true, onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const TogglesOnClick: Story = {
  name: 'Test: клик переключает состояние',
  render: () => ({
    components: { MkCheckbox },
    setup() {
      const model = ref(false);
      return { model };
    },
    template: `<mk-checkbox v-model="model" label="Чекбокс" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input).not.toBeChecked();
    await userEvent.click(input);
    await expect(input).toBeChecked();
    await userEvent.click(input);
    await expect(input).not.toBeChecked();
  },
};

export const TrueValueFalseValue: Story = {
  name: 'Test: change передаёт trueValue/falseValue',
  args: { label: 'Чекбокс', trueValue: 'yes', falseValue: 'no', onChange: fn() },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(args.onChange).toHaveBeenCalledWith('yes', expect.anything());
  },
};
