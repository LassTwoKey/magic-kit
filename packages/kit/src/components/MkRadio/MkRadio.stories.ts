import { ref } from 'vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkRadio from './MkRadio.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkRadio. Включает визуальные примеры, тесты классов и структуры DOM,
 * атрибутов нативного input, состояний, контента и событий.
 */
const meta = {
  title: 'Components/MkRadio',
  component: MkRadio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    description: { control: 'text' },
    tooltip: { control: 'text' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
    onChange: { action: 'change' },
  },
  args: {
    value: 'option-a',
    label: 'Опция A',
    disabled: false,
  },
} satisfies Meta<typeof MkRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkRadio },
    setup() {
      const val = ref(args.value);
      return { args, val };
    },
    template: `<mk-radio v-model="val" v-bind="args" />`,
  }),
};

export const Default: Story = {
  args: { label: 'Стандартная радио-кнопка' },
};

export const Checked: Story = {
  args: { modelValue: 'option-a', value: 'option-a', label: 'Выбрано' },
};

export const Unchecked: Story = {
  args: { modelValue: 'other', value: 'option-a', label: 'Не выбрано' },
};

export const Disabled: Story = {
  args: { label: 'Отключено', disabled: true },
};

export const DisabledChecked: Story = {
  name: 'Disabled Checked',
  args: { modelValue: 'option-a', value: 'option-a', label: 'Отключено и выбрано', disabled: true },
};

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    modelValue: 'option-a',
    value: 'option-a',
    label: 'Стандартный тариф',
    description: 'Включает 10 ГБ хранилища и базовую поддержку',
  },
};

export const WithTooltip: Story = {
  name: 'With Tooltip',
  args: {
    modelValue: 'option-a',
    value: 'option-a',
    label: 'Расширенный тариф',
    tooltip: 'Дополнительная информация о тарифе',
  },
};

export const FullContent: Story = {
  name: 'Full Content',
  args: {
    modelValue: 'option-a',
    value: 'option-a',
    label: 'Профессиональный тариф',
    description: 'Включает 100 ГБ хранилища и приоритетную поддержку',
    tooltip: 'Рекомендуется для команд от 10 человек',
  },
};

export const StatesVariants: Story = {
  name: 'States',
  render: () => ({
    components: { MkRadio },
    setup() {
      const val = ref('checked');
      return { val };
    },
    template: `
      <div class="d-flex ga-4">
        <mk-radio v-model="val" value="default"   label="Default" />
        <mk-radio v-model="val" value="checked"   label="Checked" />
        <mk-radio v-model="val" value="disabled"  label="Disabled" :disabled="true" />
        <mk-radio value="dis-check" model-value="dis-check" label="Disabled + Checked" :disabled="true" />
      </div>
    `,
  }),
};

export const GroupVariant: Story = {
  name: 'Interactive Group',
  render: () => ({
    components: { MkRadio },
    setup() {
      const selected = ref('b');
      return { selected };
    },
    template: `
      <div class="d-flex flex-column ga-3">
        <mk-radio v-model="selected" value="a" label="Вариант A" />
        <mk-radio v-model="selected" value="b" label="Вариант B (по умолчанию)" />
        <mk-radio v-model="selected" value="c" label="Вариант C" description="С описанием" />
        <mk-radio v-model="selected" value="d" label="Вариант D" disabled />
        <p style="font-size: 12px; color: #666; margin-top: 4px">
          Выбрано: <strong>{{ selected }}</strong>
        </p>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-radio',
  args: {},
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-radio');
    await expect(root).toBeInTheDocument();
  },
};

export const HasInputOriginal: Story = {
  name: 'Test: имеет input.mk-radio__original',
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input.mk-radio__original');
    await expect(input).toBeInTheDocument();
  },
};

export const InputTypeRadio: Story = {
  name: 'Test: input имеет type="radio"',
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('type', 'radio');
  },
};

export const HasInnerSpan: Story = {
  name: 'Test: имеет элемент .mk-radio__inner',
  args: {},
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-radio__inner');
    await expect(inner).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Атрибуты нативного input
// ─────────────────────────────────────────────

export const NameAttr: Story = {
  name: 'Test: input имеет атрибут name',
  args: { name: 'delivery' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('name', 'delivery');
  },
};

export const InputIsDisabled: Story = {
  name: 'Test: input заблокирован при disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeDisabled();
  },
};

export const InputNotDisabledByDefault: Story = {
  name: 'Test: input активен по умолчанию',
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeDisabled();
  },
};

export const InputCheckedWhenValueMatches: Story = {
  name: 'Test: input checked когда modelValue === value',
  args: { modelValue: 'option-a', value: 'option-a' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeChecked();
  },
};

export const InputNotCheckedWhenValueMismatch: Story = {
  name: 'Test: input не checked когда modelValue !== value',
  args: { modelValue: 'other', value: 'option-a' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeChecked();
  },
};

// ─────────────────────────────────────────────
// Классы состояний
// ─────────────────────────────────────────────

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-radio--disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-radio');
    await expect(root).toHaveClass('mk-radio--disabled');
  },
};

export const CheckedClass: Story = {
  name: 'Test: совпадение value добавляет класс mk-radio--checked',
  args: { modelValue: 'option-a', value: 'option-a' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-radio');
    await expect(root).toHaveClass('mk-radio--checked');
  },
};

export const InnerCheckedClass: Story = {
  name: 'Test: совпадение value добавляет класс mk-radio__inner--checked',
  args: { modelValue: 'option-a', value: 'option-a' },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-radio__inner');
    await expect(inner).toHaveClass('mk-radio__inner--checked');
  },
};

export const InnerDisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-radio__inner--disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-radio__inner');
    await expect(inner).toHaveClass('mk-radio__inner--disabled');
  },
};

export const InputWithLabelClass: Story = {
  name: 'Test: наличие label добавляет класс mk-radio__input--with-label',
  args: { label: 'С меткой' },
  play: async ({ canvasElement }) => {
    const inputWrap = canvasElement.querySelector('.mk-radio__input');
    await expect(inputWrap).toHaveClass('mk-radio__input--with-label');
  },
};

export const InputWithoutLabelClass: Story = {
  name: 'Test: отсутствие label не добавляет класс mk-radio__input--with-label',
  args: { label: undefined },
  play: async ({ canvasElement }) => {
    const inputWrap = canvasElement.querySelector('.mk-radio__input');
    await expect(inputWrap).not.toHaveClass('mk-radio__input--with-label');
  },
};

// ─────────────────────────────────────────────
// Контент: label / description / tooltip
// ─────────────────────────────────────────────

export const LabelRenders: Story = {
  name: 'Test: label отображается в .mk-radio__label',
  args: { label: 'Моя метка' },
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('.mk-radio__label');
    await expect(label).toBeInTheDocument();
    await expect(label).toHaveTextContent('Моя метка');
  },
};

export const NoLabelBlock: Story = {
  name: 'Test: без label нет блока .mk-radio__content',
  args: { label: undefined },
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-radio__content');
    await expect(content).not.toBeInTheDocument();
  },
};

export const DescriptionRenders: Story = {
  name: 'Test: description отображается в .mk-radio__description',
  args: { label: 'Метка', description: 'Описание варианта' },
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-radio__description');
    await expect(desc).toBeInTheDocument();
    await expect(desc).toHaveTextContent('Описание варианта');
  },
};

export const NoDescriptionWithoutProp: Story = {
  name: 'Test: без description нет .mk-radio__description',
  args: { label: 'Метка' },
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-radio__description');
    await expect(desc).not.toBeInTheDocument();
  },
};

export const TooltipRenders: Story = {
  name: 'Test: tooltip отображает иконку .mk-radio__tooltip',
  args: { label: 'Метка', tooltip: 'Подсказка' },
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('.mk-radio__tooltip');
    await expect(tooltip).toBeInTheDocument();
  },
};

export const NoTooltipWithoutProp: Story = {
  name: 'Test: без tooltip нет .mk-radio__tooltip',
  args: { label: 'Метка' },
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('.mk-radio__tooltip');
    await expect(tooltip).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при клике',
  render: () => ({
    components: { MkRadio },
    setup() {
      const handler = fn();
      const val = ref('other');
      return { val, handler };
    },
    template: `<mk-radio v-model="val" value="option-a" label="Опция" @update:modelValue="handler" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input).not.toBeChecked();
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при клике',
  render: () => ({
    components: { MkRadio },
    setup() {
      const onChange = fn();
      const val = ref('other');
      return { val, onChange };
    },
    template: `<mk-radio v-model="val" value="option-a" label="Опция" @change="onChange" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};

export const NoEmitWhenDisabled: Story = {
  name: 'Test: не эмитит change если disabled',
  args: { value: 'option-a', modelValue: 'other', disabled: true, onChange: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(onChange).not.toHaveBeenCalled();
  },
};

export const NoEmitWhenAlreadyChecked: Story = {
  name: 'Test: не эмитит change если уже выбрано',
  args: { value: 'option-a', modelValue: 'option-a', onChange: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(onChange).not.toHaveBeenCalled();
  },
};

export const TogglesValueOnClick: Story = {
  name: 'Test: значение обновляется при клике',
  render: () => ({
    components: { MkRadio },
    setup() {
      const val = ref('b');
      return { val };
    },
    template: `
      <div>
        <mk-radio v-model="val" value="a" label="A" />
        <mk-radio v-model="val" value="b" label="B" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input');
    await expect(inputs[1]).toBeChecked();
    await userEvent.click(inputs[0]);
    await expect(inputs[0]).toBeChecked();
    await expect(inputs[1]).not.toBeChecked();
  },
};
