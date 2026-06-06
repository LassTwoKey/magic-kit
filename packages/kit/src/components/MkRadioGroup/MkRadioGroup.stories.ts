import { ref } from 'vue';
import MkRadio from '@magic/kit/components/MkRadio/MkRadio.vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkRadioGroup from './MkRadioGroup.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkRadioGroup. Включает визуальные примеры и тесты структуры DOM,
 * рендеринга опций, disabled, событий и кастомных алиасов пропсов.
 */
const meta = {
  title: 'Components/MkRadioGroup',
  component: MkRadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MkRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4, disabled: true },
];

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    modelValue: 3,
    options: [
      { label: 'Option 1', value: 1, description: 'Description', tooltip: 'Option A' },
      { label: 'Option 2', value: 2 },
      { label: 'Option 3', value: 3 },
      { label: 'Option 4', value: 4, disabled: true },
    ],
  },
  render: (args) => ({
    components: { MkRadioGroup, MkRadio },
    setup() {
      const val = ref(args.modelValue);
      return { args, val };
    },
    template: `
      <mk-radio-group v-model="val" :options="args.options" class="d-flex flex-column ga-2" />
    `,
  }),
};

export const WithSlot: Story = {
  name: 'Slot (ручной рендеринг)',
  render: () => ({
    components: { MkRadioGroup, MkRadio },
    setup() {
      const val = ref(2);
      return { val };
    },
    template: `
      <mk-radio-group v-model="val" class="d-flex flex-column ga-2">
        <mk-radio value="1" label="Slot Option 1" />
        <mk-radio value="2" label="Slot Option 2" />
        <mk-radio value="3" label="Slot Option 3" />
      </mk-radio-group>
    `,
  }),
};

export const AllDisabled: Story = {
  name: 'Все заблокированы',
  args: { modelValue: 2, disabled: true, options: OPTIONS },
  render: (args) => ({
    components: { MkRadioGroup },
    setup() {
      const val = ref(args.modelValue);
      return { args, val };
    },
    template: `
      <mk-radio-group v-model="val" :options="args.options" :disabled="args.disabled" class="d-flex flex-column ga-2" />
    `,
  }),
};

export const CustomAliases: Story = {
  name: 'Кастомные алиасы пропсов',
  render: () => ({
    components: { MkRadioGroup },
    setup() {
      const val = ref('b');
      const options = [
        { name: 'Alpha', id: 'a' },
        { name: 'Beta', id: 'b' },
        { name: 'Gamma', id: 'c' },
      ];
      const propsMap = { label: 'name', value: 'id', disabled: 'disabled' };
      return { val, options, propsMap };
    },
    template: `
      <mk-radio-group v-model="val" :options="options" :props="propsMap" class="d-flex flex-column ga-2" />
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-radio-group',
  args: { options: OPTIONS },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('.mk-radio-group');
    await expect(group).toBeInTheDocument();
  },
};

export const HasRoleRadiogroup: Story = {
  name: 'Test: имеет role="radiogroup"',
  args: { options: OPTIONS },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="radiogroup"]');
    await expect(group).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Рендеринг опций через prop options
// ─────────────────────────────────────────────

export const RendersAllOptions: Story = {
  name: 'Test: рендерит все опции из options',
  args: { options: OPTIONS },
  play: async ({ canvasElement }) => {
    const radios = canvasElement.querySelectorAll('input[type="radio"]');
    await expect(radios).toHaveLength(OPTIONS.length);
  },
};

export const RendersOptionLabels: Story = {
  name: 'Test: рендерит метки опций',
  args: { options: OPTIONS },
  play: async ({ canvasElement }) => {
    for (const option of OPTIONS) {
      const label = Array.from(canvasElement.querySelectorAll('.mk-radio__label')).find(
        (el) => el.textContent?.trim() === option.label
      );
      await expect(label).toBeDefined();
    }
  },
};

export const CheckedOptionMatchesModelValue: Story = {
  name: 'Test: checked совпадает с modelValue',
  args: { modelValue: 2, options: OPTIONS },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    // второй input (value=2) должен быть checked
    await expect(inputs[1]).toBeChecked();
    await expect(inputs[0]).not.toBeChecked();
    await expect(inputs[2]).not.toBeChecked();
  },
};

export const NoCheckedWithoutModelValue: Story = {
  name: 'Test: ни один input не checked если modelValue не задан',
  args: { options: OPTIONS },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    for (const input of Array.from(inputs)) {
      await expect(input).not.toBeChecked();
    }
  },
};

// ─────────────────────────────────────────────
// Disabled
// ─────────────────────────────────────────────

export const GroupDisabledBlocksAllInputs: Story = {
  name: 'Test: disabled на группе блокирует все input',
  args: { disabled: true, options: OPTIONS },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    for (const input of Array.from(inputs)) {
      await expect(input).toBeDisabled();
    }
  },
};

export const OptionDisabledBlocksSingleInput: Story = {
  name: 'Test: disabled на опции блокирует только её input',
  args: { options: OPTIONS },
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    // OPTIONS[3] (value=4) имеет disabled: true
    await expect(inputs[3]).toBeDisabled();
    await expect(inputs[0]).not.toBeDisabled();
    await expect(inputs[1]).not.toBeDisabled();
    await expect(inputs[2]).not.toBeDisabled();
  },
};

// ─────────────────────────────────────────────
// Кастомные алиасы props
// ─────────────────────────────────────────────

export const CustomPropsAliases: Story = {
  name: 'Test: кастомные алиасы props рендерят правильные метки',
  render: () => ({
    components: { MkRadioGroup },
    setup() {
      const val = ref('b');
      const options = [
        { name: 'Alpha', id: 'a' },
        { name: 'Beta', id: 'b' },
      ];
      const propsMap = { label: 'name', value: 'id', disabled: 'disabled' };
      return { val, options, propsMap };
    },
    template: `<mk-radio-group v-model="val" :options="options" :props="propsMap" />`,
  }),
  play: async ({ canvasElement }) => {
    const labels = canvasElement.querySelectorAll('.mk-radio__label');
    await expect(labels[0]).toHaveTextContent('Alpha');
    await expect(labels[1]).toHaveTextContent('Beta');
  },
};

export const CustomPropsAliasesChecked: Story = {
  name: 'Test: кастомные алиасы props — checked соответствует кастомному value',
  render: () => ({
    components: { MkRadioGroup },
    setup() {
      const val = ref('b');
      const options = [
        { name: 'Alpha', id: 'a' },
        { name: 'Beta', id: 'b' },
      ];
      const propsMap = { label: 'name', value: 'id', disabled: 'disabled' };
      return { val, options, propsMap };
    },
    template: `<mk-radio-group v-model="val" :options="options" :props="propsMap" />`,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await expect(inputs[1]).toBeChecked(); // id='b' совпадает с modelValue='b'
    await expect(inputs[0]).not.toBeChecked();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при выборе опции',
  render: (args) => ({
    components: { MkRadioGroup, MkRadio },
    setup() {
      const val = ref(1);
      return { args, val };
    },
    template: `
      <mk-radio-group v-model="val" :options="args.options" v-bind="args" />
    `,
  }),
  args: {
    options: OPTIONS,
    'onUpdate:modelValue': fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { 'onUpdate:modelValue': onUpdate } = args as {
      'onUpdate:modelValue': ReturnType<typeof fn>;
    };
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await userEvent.click(inputs[1]); // value=2
    await expect(onUpdate).toHaveBeenCalledWith(2);
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при выборе опции',
  render: (args) => ({
    components: { MkRadioGroup },
    setup() {
      const val = ref(1);
      return { args, val };
    },
    template: `<mk-radio-group v-model="val" :options="args.options" v-bind="args" />`,
  }),
  args: {
    options: OPTIONS,
    onChange: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await userEvent.click(inputs[2]); // value=3
    await expect(onChange).toHaveBeenCalledWith(3);
  },
};

export const NoEmitWhenGroupDisabled: Story = {
  name: 'Test: не эмитит change если группа disabled',
  render: (args) => ({
    components: { MkRadioGroup },
    setup() {
      const val = ref(1);
      return { args, val };
    },
    template: `<mk-radio-group v-model="val" :options="args.options" :disabled="args.disabled" v-bind="args" />`,
  }),
  args: {
    options: OPTIONS,
    disabled: true,
    onChange: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await userEvent.click(inputs[0]);
    await expect(onChange).not.toHaveBeenCalled();
  },
};

export const NoEmitWhenOptionDisabled: Story = {
  name: 'Test: не эмитит change если опция disabled',
  render: (args) => ({
    components: { MkRadioGroup },
    setup() {
      const val = ref(1);
      return { args, val };
    },
    template: `<mk-radio-group v-model="val" :options="args.options" v-bind="args" />`,
  }),
  args: {
    options: OPTIONS,
    onChange: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await userEvent.click(inputs[3]); // value=4, disabled
    await expect(onChange).not.toHaveBeenCalled();
  },
};

// ─────────────────────────────────────────────
// Слот
// ─────────────────────────────────────────────

export const SlotOverridesOptions: Story = {
  name: 'Test: слот переопределяет рендеринг через options',
  render: () => ({
    components: { MkRadioGroup, MkRadio },
    setup() {
      const val = ref('x');
      return { val };
    },
    template: `
      <mk-radio-group v-model="val" :options="[{ label: 'Never', value: 'never' }]">
        <mk-radio value="x" label="Slot X" />
        <mk-radio value="y" label="Slot Y" />
      </mk-radio-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const labels = canvasElement.querySelectorAll('.mk-radio__label');
    await expect(labels).toHaveLength(2);
    await expect(labels[0]).toHaveTextContent('Slot X');
    await expect(labels[1]).toHaveTextContent('Slot Y');
  },
};

export const SlotCheckedMatchesGroupModelValue: Story = {
  name: 'Test: слот — checked соответствует modelValue группы',
  render: () => ({
    components: { MkRadioGroup, MkRadio },
    setup() {
      const val = ref('y');
      return { val };
    },
    template: `
      <mk-radio-group v-model="val">
        <mk-radio value="x" label="X" />
        <mk-radio value="y" label="Y" />
      </mk-radio-group>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    await expect(inputs[1]).toBeChecked(); // value='y' совпадает с modelValue='y'
    await expect(inputs[0]).not.toBeChecked();
  },
};
