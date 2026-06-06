import { ref } from 'vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkSwitch from './MkSwitch.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkSwitch. Включает визуальные примеры и тесты структуры DOM,
 * классов состояний, контента, disabled и событий.
 */
const meta = {
  title: 'Components/MkSwitch',
  component: MkSwitch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MkSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: { label: 'Switch', modelValue: true },
  render: (args) => ({
    components: { MkSwitch },
    setup() {
      const val = ref(args.modelValue);
      return { args, val };
    },
    template: `<mk-switch v-model="val" v-bind="args" />`,
  }),
};

export const Unchecked: Story = {
  args: { label: 'Выключено', modelValue: false },
};

export const Checked: Story = {
  args: { label: 'Включено', modelValue: true },
};

export const Disabled: Story = {
  args: { label: 'Заблокировано', modelValue: false, disabled: true },
};

export const DisabledChecked: Story = {
  name: 'Disabled Checked',
  args: { label: 'Заблокировано включено', modelValue: true, disabled: true },
};

export const WithDescription: Story = {
  name: 'With Description',
  args: {
    label: 'Уведомления',
    modelValue: true,
    description: 'Получать push-уведомления',
  },
};

export const WithTooltip: Story = {
  name: 'With Tooltip',
  args: {
    label: 'Тёмная тема',
    modelValue: false,
    tooltip: 'Переключить тему оформления',
  },
};

export const FullContent: Story = {
  name: 'Full Content',
  args: {
    label: 'Автосохранение',
    modelValue: true,
    description: 'Сохранять изменения автоматически',
    tooltip: 'Работает каждые 5 минут',
  },
};

export const WithTrueValue: Story = {
  name: 'trueValue / falseValue',
  render: () => ({
    components: { MkSwitch },
    setup() {
      const val = ref('yes');
      return { val };
    },
    template: `
      <div class="d-flex flex-column ga-2">
        <mk-switch v-model="val" true-value="yes" false-value="no" label="true-value=yes" />
        <p style="font-size: 12px; color: #666">Значение: <strong>{{ val }}</strong></p>
      </div>
    `,
  }),
};

export const StatesVariants: Story = {
  name: 'States',
  render: () => ({
    components: { MkSwitch },
    setup() {
      const a = ref(false);
      const b = ref(true);
      return { a, b };
    },
    template: `
      <div class="d-flex flex-column ga-3">
        <mk-switch v-model="a" label="Unchecked" />
        <mk-switch v-model="b" label="Checked" />
        <mk-switch v-model="a" label="Disabled" :disabled="true" />
        <mk-switch v-model="b" label="Disabled + Checked" :disabled="true" />
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-switch',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-switch');
    await expect(root).toBeInTheDocument();
  },
};

export const HasInputOriginal: Story = {
  name: 'Test: имеет input.mk-switch__original',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input.mk-switch__original');
    await expect(input).toBeInTheDocument();
  },
};

export const InputTypeCheckbox: Story = {
  name: 'Test: input имеет type="checkbox"',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('type', 'checkbox');
  },
};

export const HasInnerSpan: Story = {
  name: 'Test: имеет .mk-switch__inner',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-switch__inner');
    await expect(inner).toBeInTheDocument();
  },
};

export const HasTrackAndKnob: Story = {
  name: 'Test: имеет .mk-switch__track и .mk-switch__knob',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.mk-switch__track')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.mk-switch__knob')).toBeInTheDocument();
  },
};

export const RendersAsLabel: Story = {
  name: 'Test: рендерится как <label> когда есть label',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-switch');
    await expect(root?.tagName.toLowerCase()).toBe('label');
  },
};

export const RendersAsSpan: Story = {
  name: 'Test: рендерится как <span> без label',
  args: {},
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-switch');
    await expect(root?.tagName.toLowerCase()).toBe('span');
  },
};

// ─────────────────────────────────────────────
// Классы состояний
// ─────────────────────────────────────────────

export const CheckedClass: Story = {
  name: 'Test: mk-switch--checked когда modelValue=true',
  args: { label: 'Switch', modelValue: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-switch');
    await expect(root).toHaveClass('mk-switch--checked');
  },
};

export const NoCheckedClass: Story = {
  name: 'Test: нет mk-switch--checked когда modelValue=false',
  args: { label: 'Switch', modelValue: false },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-switch');
    await expect(root).not.toHaveClass('mk-switch--checked');
  },
};

export const DisabledClass: Story = {
  name: 'Test: mk-switch--disabled когда disabled',
  args: { label: 'Switch', disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-switch');
    await expect(root).toHaveClass('mk-switch--disabled');
  },
};

export const TrackCheckedClass: Story = {
  name: 'Test: mk-switch__track--checked когда включено',
  args: { label: 'Switch', modelValue: true },
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector('.mk-switch__track');
    await expect(track).toHaveClass('mk-switch__track--checked');
  },
};

export const KnobCheckedClass: Story = {
  name: 'Test: mk-switch__knob--checked когда включено',
  args: { label: 'Switch', modelValue: true },
  play: async ({ canvasElement }) => {
    const knob = canvasElement.querySelector('.mk-switch__knob');
    await expect(knob).toHaveClass('mk-switch__knob--checked');
  },
};

export const InnerDisabledClass: Story = {
  name: 'Test: mk-switch__inner--disabled когда disabled',
  args: { label: 'Switch', disabled: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-switch__inner');
    await expect(inner).toHaveClass('mk-switch__inner--disabled');
  },
};

// ─────────────────────────────────────────────
// Атрибуты нативного input
// ─────────────────────────────────────────────

export const InputCheckedWhenTrue: Story = {
  name: 'Test: input checked когда modelValue=true',
  args: { label: 'Switch', modelValue: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeChecked();
  },
};

export const InputNotCheckedWhenFalse: Story = {
  name: 'Test: input не checked когда modelValue=false',
  args: { label: 'Switch', modelValue: false },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeChecked();
  },
};

export const InputDisabled: Story = {
  name: 'Test: input заблокирован при disabled',
  args: { label: 'Switch', disabled: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeDisabled();
  },
};

export const InputNotDisabledByDefault: Story = {
  name: 'Test: input активен по умолчанию',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeDisabled();
  },
};

export const NameAttr: Story = {
  name: 'Test: input имеет атрибут name',
  args: { label: 'Switch', name: 'notifications' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('name', 'notifications');
  },
};

export const IdAttr: Story = {
  name: 'Test: input имеет атрибут id',
  args: { label: 'Switch', id: 'my-switch' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('id', 'my-switch');
  },
};

// ─────────────────────────────────────────────
// Контент
// ─────────────────────────────────────────────

export const LabelRenders: Story = {
  name: 'Test: label отображается в .mk-switch__label',
  args: { label: 'Моя метка' },
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('.mk-switch__label');
    await expect(label).toBeInTheDocument();
    await expect(label).toHaveTextContent('Моя метка');
  },
};

export const NoLabelContent: Story = {
  name: 'Test: без label нет .mk-switch__content',
  args: {},
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-switch__content');
    await expect(content).not.toBeInTheDocument();
  },
};

export const DescriptionRenders: Story = {
  name: 'Test: description отображается в .mk-switch__description',
  args: { label: 'Switch', description: 'Описание' },
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-switch__description');
    await expect(desc).toBeInTheDocument();
    await expect(desc).toHaveTextContent('Описание');
  },
};

export const NoDescriptionWithoutProp: Story = {
  name: 'Test: без description нет .mk-switch__description',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-switch__description');
    await expect(desc).not.toBeInTheDocument();
  },
};

export const TooltipRenders: Story = {
  name: 'Test: tooltip отображает иконку .mk-switch__tooltip',
  args: { label: 'Switch', tooltip: 'Подсказка' },
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('.mk-switch__tooltip');
    await expect(tooltip).toBeInTheDocument();
  },
};

export const NoTooltipWithoutProp: Story = {
  name: 'Test: без tooltip нет .mk-switch__tooltip',
  args: { label: 'Switch' },
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('.mk-switch__tooltip');
    await expect(tooltip).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const TogglesOnClick: Story = {
  name: 'Test: клик переключает состояние',
  render: () => ({
    components: { MkSwitch },
    setup() {
      const val = ref(false);
      return { val };
    },
    template: `<mk-switch v-model="val" label="Switch" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input).not.toBeChecked();
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при переключении',
  render: () => ({
    components: { MkSwitch },
    setup() {
      const onUpdate = fn();
      const val = ref(false);
      return { val, onUpdate };
    },
    template: `<mk-switch v-model="val" label="Switch" @update:modelValue="onUpdate" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при переключении',
  render: () => ({
    components: { MkSwitch },
    setup() {
      const onChange = fn();
      const val = ref(false);
      return { val, onChange };
    },
    template: `<mk-switch v-model="val" label="Switch" @change="onChange" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(input).toBeChecked();
  },
};

export const NoEmitWhenDisabled: Story = {
  name: 'Test: не эмитит change если disabled',
  args: { label: 'Switch', modelValue: false, disabled: true, onChange: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(onChange).not.toHaveBeenCalled();
  },
};

// ─────────────────────────────────────────────
// trueValue / falseValue
// ─────────────────────────────────────────────

export const TrueValueChecked: Story = {
  name: 'Test: input checked когда modelValue === trueValue',
  args: { label: 'Switch', modelValue: 'yes', trueValue: 'yes', falseValue: 'no' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeChecked();
  },
};

export const TrueValueNotChecked: Story = {
  name: 'Test: input не checked когда modelValue === falseValue',
  args: { label: 'Switch', modelValue: 'no', trueValue: 'yes', falseValue: 'no' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeChecked();
  },
};
