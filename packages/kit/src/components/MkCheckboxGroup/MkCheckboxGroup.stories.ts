import { ref } from 'vue';
import MkCheckbox from '@magic/kit/components/MkCheckbox/MkCheckbox.vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkCheckboxGroup from './MkCheckboxGroup.vue';

import type { Size } from '@magic/kit/types';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkCheckboxGroup. Включает визуальные примеры, тесты классов и структуры DOM,
 * работы пропсов options/disabled/size/min/max, событий и слота по умолчанию.
 */
const meta = {
  title: 'Components/MkCheckboxGroup',
  component: MkCheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: {
      table: { type: { summary: 'ModelValue[]' } },
      control: { type: 'object' },
    },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'lg'] satisfies Size[],
    },
    options: {
      table: { type: { summary: 'CheckboxOption[]' } },
      control: { type: 'object' },
    },
    props: {
      table: { type: { summary: '{ label?: string; value?: string; disabled?: string }' } },
      control: { type: 'object' },
    },
    min: { control: 'number' },
    max: { control: 'number' },
  },
} satisfies Meta<typeof MkCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    options: [
      { label: 'Option A', value: 'a', description: 'Описание', tooltip: 'Подсказка' },
      { label: 'Option B', value: 'b' },
      { label: 'Option C', value: 'c' },
      { label: 'Option D', value: 'd', disabled: true },
    ],
    min: 1,
    max: 3,
  },
  render: (args) => ({
    components: { MkCheckboxGroup },
    setup() {
      const state = ref(['a']);
      return { args, state };
    },
    template: `
      <mk-checkbox-group
        v-model="state"
        :options="args.options"
        :min="args.min"
        :max="args.max"
        :size="args.size"
        :disabled="args.disabled"
      />
    `,
  }),
};

export const Default: Story = {
  args: {
    modelValue: ['a'],
    options: defaultOptions,
  },
};

export const Disabled: Story = {
  args: {
    modelValue: ['a'],
    options: defaultOptions,
    disabled: true,
  },
};

export const SizeSm: Story = {
  args: {
    modelValue: ['a'],
    options: defaultOptions,
    size: 'sm',
  },
};

export const WithDescription: Story = {
  args: {
    modelValue: ['a'],
    options: [
      { label: 'Option A', value: 'a', description: 'Описание первой опции', tooltip: 'Подсказка' },
      { label: 'Option B', value: 'b', description: 'Описание второй опции' },
      { label: 'Option C', value: 'c', disabled: true },
    ],
  },
};

export const WithMinMax: Story = {
  name: 'Min / Max',
  args: {
    modelValue: ['a'],
    options: defaultOptions,
    min: 1,
    max: 2,
  },
};

export const WithCustomAliases: Story = {
  name: 'Custom Field Aliases',
  args: {
    modelValue: ['val-a'],
    options: [
      { name: 'Option A', id: 'val-a' },
      { name: 'Option B', id: 'val-b' },
      { name: 'Option C', id: 'val-c' },
    ],
    props: { label: 'name', value: 'id' },
  },
};

export const WithSlot: Story = {
  name: 'With Slot',
  render: () => ({
    components: { MkCheckboxGroup, MkCheckbox },
    setup() {
      const state = ref(['a']);
      return { state };
    },
    template: `
      <mk-checkbox-group v-model="state" class="d-flex flex-column ga-2">
        <mk-checkbox value="a" label="Option A" />
        <mk-checkbox value="b" label="Option B" />
        <mk-checkbox value="c" label="Option C" />
      </mk-checkbox-group>
    `,
  }),
};

export const MinMaxVariants: Story = {
  name: 'Min / Max Variants',
  render: () => ({
    components: { MkCheckboxGroup, MkCheckbox },
    setup() {
      const state = ref(['a']);
      return { state };
    },
    template: `
      <mk-checkbox-group v-model="state" :min="1" :max="2" class="d-flex flex-column ga-2">
        <mk-checkbox value="a" label="Option A" />
        <mk-checkbox value="b" label="Option B" />
        <mk-checkbox value="c" label="Option C" />
      </mk-checkbox-group>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-checkbox-group',
  args: { options: defaultOptions, modelValue: [] },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('.mk-checkbox-group');
    await expect(group).toBeInTheDocument();
  },
};

export const HasRoleGroup: Story = {
  name: 'Test: имеет role="group"',
  args: { options: defaultOptions, modelValue: [] },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"]');
    await expect(group).toBeInTheDocument();
  },
};

export const RendersOptionsCount: Story = {
  name: 'Test: рендерит правильное кол-во чекбоксов',
  args: { options: defaultOptions, modelValue: [] },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    await expect(inputs).toHaveLength(3);
  },
};

export const RendersNoCheckboxesWithoutOptions: Story = {
  name: 'Test: без options не рендерит чекбоксы',
  args: { modelValue: [] },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    await expect(inputs).toHaveLength(0);
  },
};

// ─────────────────────────────────────────────
// Пропсы
// ─────────────────────────────────────────────

export const CheckedOptionsHaveCheckedInputs: Story = {
  name: 'Test: элементы из modelValue имеют checked input',
  args: { options: defaultOptions, modelValue: ['a', 'c'] },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    await expect(inputs[0]).toBeChecked();
    await expect(inputs[1]).not.toBeChecked();
    await expect(inputs[2]).toBeChecked();
  },
};

export const DisabledPropDisablesAllInputs: Story = {
  name: 'Test: disabled блокирует все чекбоксы',
  args: { options: defaultOptions, modelValue: [], disabled: true },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    for (const input of inputs) {
      await expect(input).toBeDisabled();
    }
  },
};

export const SizeSmPassedToCheckboxes: Story = {
  name: 'Test: size sm передаётся дочерним чекбоксам',
  args: { options: defaultOptions, modelValue: [], size: 'sm' },
  play: async ({ canvasElement }) => {
    const checkboxes = canvasElement.querySelectorAll('.mk-checkbox');
    for (const cb of checkboxes) {
      await expect(cb).toHaveClass('mk-checkbox--sm');
    }
  },
};

export const MaxEnforcesDisable: Story = {
  name: 'Test: max блокирует незачекнутые чекбоксы при достижении лимита',
  args: { options: defaultOptions, modelValue: ['a', 'b'], max: 2 },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    await expect(inputs[0]).not.toBeDisabled();
    await expect(inputs[1]).not.toBeDisabled();
    await expect(inputs[2]).toBeDisabled();
  },
};

export const MinEnforcesDisable: Story = {
  name: 'Test: min блокирует зачекнутые чекбоксы при достижении минимума',
  args: { options: defaultOptions, modelValue: ['a'], min: 1 },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input[type="checkbox"]');
    await expect(inputs[0]).toBeDisabled();
    await expect(inputs[1]).not.toBeDisabled();
  },
};

export const CustomAliasesRenderLabels: Story = {
  name: 'Test: пользовательские алиасы корректно маппят label/value',
  args: {
    options: [{ title: 'Опция', id: 'x' }],
    props: { label: 'title', value: 'id' },
    modelValue: [],
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Опция', { selector: '.mk-checkbox__label' });
    await expect(label).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при клике',
  args: {
    options: [{ label: 'Option A', value: 'a' }],
    modelValue: [],
    'onUpdate:modelValue': fn(),
  },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(args['onUpdate:modelValue']).toHaveBeenCalledWith(['a']);
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при клике',
  args: {
    options: [{ label: 'Option A', value: 'a' }],
    modelValue: [],
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(args.onChange).toHaveBeenCalledWith(['a']);
  },
};

export const NoChangeWhenDisabled: Story = {
  name: 'Test: не эмитит change если disabled',
  args: {
    options: [{ label: 'Option A', value: 'a' }],
    modelValue: [],
    disabled: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const TogglesOnClick: Story = {
  name: 'Test: клик добавляет и снимает выбор',
  render: () => ({
    components: { MkCheckboxGroup },
    setup() {
      const state = ref<string[]>([]);
      return { state };
    },
    template: `
      <mk-checkbox-group v-model="state" :options="[{ label: 'Option A', value: 'a' }]" />
    `,
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
