import { ref } from 'vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkSlider from './MkSlider.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkSlider. Компонент реализует слайдер для выбора числового значения
 * (или диапазона) — пользователь перетаскивает кнопку по дорожке для выбора значения.
 * Включает визуальные примеры и тесты структуры DOM, классов состояний,
 * tooltip, range-режима, меток, вертикального режима и событий.
 */
const meta = {
  title: 'Components/MkSlider',
  component: MkSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: {
      control: 'number',
    },
    min: {
      control: 'number',
    },
    max: {
      control: 'number',
    },
    step: {
      control: 'number',
    },
    showTooltip: {
      control: 'boolean',
    },
    tooltip: {
      control: 'select',
      options: ['arrow', 'no-arrow'],
    },
    range: {
      control: 'boolean',
    },
    vertical: {
      control: 'boolean',
    },
    height: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof MkSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Playground
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    modelValue: 30,
    min: 0,
    max: 100,
    step: 1,
    showTooltip: true,
    tooltip: 'arrow',
  },
  render: (args) => ({
    components: { MkSlider },
    setup() {
      const value = ref(args.modelValue as number);
      return { value, args };
    },
    template: `<mk-slider v-bind="args" v-model="value" style="width: 400px" />`,
  }),
};

// ─────────────────────────────────────────────
// Базовые стори
// ─────────────────────────────────────────────

export const Basic: Story = {
  name: 'Базовый',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
};

export const WithStep: Story = {
  name: 'С шагом (step=10)',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(20);
      return { value };
    },
    template: `<mk-slider v-model="value" :step="10" style="width: 400px" />`,
  }),
};

export const DecimalStep: Story = {
  name: 'Дробный шаг (step=0.1)',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(0.5);
      return { value };
    },
    template: `<mk-slider v-model="value" :min="0" :max="1" :step="0.1" style="width: 400px" />`,
  }),
};

export const CustomMinMax: Story = {
  name: 'Произвольный диапазон (min=20, max=80)',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(40);
      return { value };
    },
    template: `<mk-slider v-model="value" :min="20" :max="80" style="width: 400px" />`,
  }),
};

// ─────────────────────────────────────────────
// Tooltip
// ─────────────────────────────────────────────

export const TooltipWithArrow: Story = {
  name: 'Tooltip со стрелкой',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" show-tooltip tooltip="arrow" style="width: 400px" />`,
  }),
};

export const TooltipNoArrow: Story = {
  name: 'Tooltip без стрелки',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" show-tooltip tooltip="no-arrow" style="width: 400px" />`,
  }),
};

export const WithoutTooltip: Story = {
  name: 'Без tooltip',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" :show-tooltip="false" style="width: 400px" />`,
  }),
};

// ─────────────────────────────────────────────
// Range
// ─────────────────────────────────────────────

export const Range: Story = {
  name: 'Range (диапазон)',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref([20, 70]);
      return { value };
    },
    template: `<mk-slider v-model="value" range style="width: 400px" />`,
  }),
};

export const RangeWithStep: Story = {
  name: 'Range с шагом',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref([10, 50]);
      return { value };
    },
    template: `<mk-slider v-model="value" range :step="10" style="width: 400px" />`,
  }),
};

// ─────────────────────────────────────────────
// Marks
// ─────────────────────────────────────────────

export const WithMarks: Story = {
  name: 'С метками (marks)',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      const marks: Record<number, string> = {
        0: '0',
        25: '25',
        50: '50',
        75: '75',
        100: '100',
      };
      return { value, marks };
    },
    template: `<mk-slider v-model="value" :marks="marks" style="width: 400px" />`,
  }),
};

export const RangeWithMarks: Story = {
  name: 'Range с метками',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref([20, 80]);
      const marks: Record<number, string> = {
        0: '0',
        25: '25%',
        50: '50%',
        75: '75%',
        100: '100%',
      };
      return { value, marks };
    },
    template: `<mk-slider v-model="value" range :marks="marks" style="width: 400px" />`,
  }),
};

// ─────────────────────────────────────────────
// Vertical
// ─────────────────────────────────────────────

export const Vertical: Story = {
  name: 'Вертикальный',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(40);
      return { value };
    },
    template: `<mk-slider v-model="value" vertical height="300px" />`,
  }),
};

export const VerticalRange: Story = {
  name: 'Вертикальный Range',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref([20, 70]);
      return { value };
    },
    template: `<mk-slider v-model="value" range vertical height="300px" />`,
  }),
};

export const VerticalWithMarks: Story = {
  name: 'Вертикальный с метками',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(50);
      const marks: Record<number, string> = {
        0: '0',
        50: '50',
        100: '100',
      };
      return { value, marks };
    },
    template: `<mk-slider v-model="value" vertical height="300px" :marks="marks" />`,
  }),
};

// ─────────────────────────────────────────────
// Disabled
// ─────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Отключен',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(40);
      return { value };
    },
    template: `<mk-slider v-model="value" disabled style="width: 400px" />`,
  }),
};

export const DisabledRange: Story = {
  name: 'Отключен Range',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref([20, 70]);
      return { value };
    },
    template: `<mk-slider v-model="value" range disabled style="width: 400px" />`,
  }),
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const WithChangeEvent: Story = {
  name: 'Событие change',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      const lastChange = ref<number | number[] | null>(null);

      const onChange = (val: number | number[]) => {
        lastChange.value = val;
      };

      return { value, lastChange, onChange };
    },
    template: `
      <div style="width: 400px">
        <mk-slider v-model="value" @change="onChange" />
        <p style="margin-top: 16px; font-size: 13px; color: #757575">
          Текущее значение: {{ value }} <br />
          Последний change: {{ lastChange ?? 'ещё не было' }}
        </p>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: DOM-структура
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-slider',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const slider = canvasElement.querySelector('.mk-slider');
    await expect(slider).toHaveClass('mk-slider');
  },
};

export const HasRunway: Story = {
  name: 'Test: содержит runway',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const runway = canvasElement.querySelector('.mk-slider__runway');
    await expect(runway).toBeInTheDocument();
  },
};

export const HasBar: Story = {
  name: 'Test: содержит bar',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(50);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('.mk-slider__bar');
    await expect(bar).toBeInTheDocument();
  },
};

export const HasOneButtonSingleMode: Story = {
  name: 'Test: одна кнопка в одиночном режиме',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('.mk-slider__button-wrapper');
    await expect(buttons.length).toBe(1);
  },
};

export const HasTwoButtonsRangeMode: Story = {
  name: 'Test: две кнопки в режиме range',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref([20, 70]);
      return { value };
    },
    template: `<mk-slider v-model="value" range style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('.mk-slider__button-wrapper');
    await expect(buttons.length).toBe(2);
  },
};

// ─────────────────────────────────────────────
// Тесты: Модификаторы
// ─────────────────────────────────────────────

export const VerticalClass: Story = {
  name: 'Test: вертикальный модификатор',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" vertical height="200px" />`,
  }),
  play: async ({ canvasElement }) => {
    const slider = canvasElement.querySelector('.mk-slider');
    await expect(slider).toHaveClass('mk-slider--vertical');
  },
};

export const DisabledClass: Story = {
  name: 'Test: модификатор disabled',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" disabled style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const slider = canvasElement.querySelector('.mk-slider');
    await expect(slider).toHaveClass('mk-slider--disabled');
  },
};

// ─────────────────────────────────────────────
// Тесты: ARIA-атрибуты
// ─────────────────────────────────────────────

export const ButtonRoleSlider: Story = {
  name: 'Test: кнопка имеет role=slider',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('role', 'slider');
  },
};

export const AriaValueMin: Story = {
  name: 'Test: aria-valuemin',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" :min="10" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('aria-valuemin', '10');
  },
};

export const AriaValueMax: Story = {
  name: 'Test: aria-valuemax',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" :max="200" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('aria-valuemax', '200');
  },
};

export const AriaValueNow: Story = {
  name: 'Test: aria-valuenow отражает значение',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(42);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('aria-valuenow', '42');
  },
};

export const AriaDisabledTrue: Story = {
  name: 'Test: aria-disabled=true при disabled',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" disabled style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
  },
};

export const AriaOrientationHorizontal: Story = {
  name: 'Test: aria-orientation horizontal по умолчанию',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('aria-orientation', 'horizontal');
  },
};

export const AriaOrientationVertical: Story = {
  name: 'Test: aria-orientation vertical',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" vertical height="200px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('aria-orientation', 'vertical');
  },
};

// ─────────────────────────────────────────────
// Тесты: Marks
// ─────────────────────────────────────────────

export const MarksRendered: Story = {
  name: 'Test: marks рендерятся',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      const marks: Record<number, string> = { 0: '0', 50: '50', 100: '100' };
      return { value, marks };
    },
    template: `<mk-slider v-model="value" :marks="marks" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const marks = canvasElement.querySelectorAll('.mk-slider__mark');
    await expect(marks.length).toBe(3);
  },
};

export const HasMarksClass: Story = {
  name: 'Test: модификатор has-marks при marks',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      const marks: Record<number, string> = { 0: '0', 100: '100' };
      return { value, marks };
    },
    template: `<mk-slider v-model="value" :marks="marks" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const slider = canvasElement.querySelector('.mk-slider');
    await expect(slider).toHaveClass('mk-slider--has-marks');
  },
};

export const NoMarksContainer: Story = {
  name: 'Test: нет marks без пропса',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const marks = canvasElement.querySelector('.mk-slider__marks');
    await expect(marks).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: Tabindex и фокус
// ─────────────────────────────────────────────

export const TabindexZero: Story = {
  name: 'Test: tabindex=0 на кнопке',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).toHaveAttribute('tabindex', '0');
  },
};

export const NoTabindexWhenDisabled: Story = {
  name: 'Test: нет tabindex при disabled',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" disabled style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper');
    await expect(button).not.toHaveAttribute('tabindex');
  },
};

export const FocusVisible: Story = {
  name: 'Test: кнопка получает фокус',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper') as HTMLElement;
    button.focus();
    await expect(document.activeElement).toBe(button);
  },
};

// ─────────────────────────────────────────────
// Тесты: События
// ─────────────────────────────────────────────

export const EmitsChange: Story = {
  name: 'Test: эмитит change',
  args: {
    onChange: fn(),
  },
  render: (args) => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value, args };
    },
    template: `<mk-slider v-bind="args" v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper') as HTMLElement;
    button.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const ChangeFiresOnKeyHome: Story = {
  name: 'Test: change срабатывает при Home',
  args: {
    onChange: fn(),
  },
  render: (args) => ({
    components: { MkSlider },
    setup() {
      const value = ref(50);
      return { value, args };
    },
    template: `<mk-slider v-bind="args" v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper') as HTMLElement;
    button.focus();
    await userEvent.keyboard('{Home}');
    await expect(args.onChange).toHaveBeenCalledWith(0);
  },
};

export const ChangeFiresOnKeyEnd: Story = {
  name: 'Test: change срабатывает при End',
  args: {
    onChange: fn(),
  },
  render: (args) => ({
    components: { MkSlider },
    setup() {
      const value = ref(50);
      return { value, args };
    },
    template: `<mk-slider v-bind="args" v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper') as HTMLElement;
    button.focus();
    await userEvent.keyboard('{End}');
    await expect(args.onChange).toHaveBeenCalledWith(100);
  },
};

// ─────────────────────────────────────────────
// Тесты: Tooltip
// ─────────────────────────────────────────────

export const NoTooltipElement: Story = {
  name: 'Test: нет tooltip при show-tooltip=false',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(30);
      return { value };
    },
    template: `<mk-slider v-model="value" :show-tooltip="false" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const tooltip = canvasElement.querySelector('.mk-tooltip');
    await expect(tooltip).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: Bar и значение
// ─────────────────────────────────────────────

export const BarWidthAtZero: Story = {
  name: 'Test: bar ширина 0 при значении min',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(0);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('.mk-slider__bar') as HTMLElement;
    await expect(bar.style.width).toBe('0%');
  },
};

export const BarWidthAtMax: Story = {
  name: 'Test: bar ширина 100% при значении max',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(100);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('.mk-slider__bar') as HTMLElement;
    await expect(bar.style.width).toBe('100%');
  },
};

export const BarWidthAtMiddle: Story = {
  name: 'Test: bar ширина 50% при значении 50',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref(50);
      return { value };
    },
    template: `<mk-slider v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('.mk-slider__bar') as HTMLElement;
    await expect(bar.style.width).toBe('50%');
  },
};

// ─────────────────────────────────────────────
// Тесты: Range ARIA
// ─────────────────────────────────────────────

export const RangeSecondButtonAria: Story = {
  name: 'Test: вторая кнопка имеет корректные ARIA в range',
  render: () => ({
    components: { MkSlider },
    setup() {
      const value = ref([20, 70]);
      return { value };
    },
    template: `<mk-slider v-model="value" range style="width: 400px" />`,
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('.mk-slider__button-wrapper');
    await expect(buttons[0]).toHaveAttribute('aria-valuenow', '20');
    await expect(buttons[1]).toHaveAttribute('aria-valuenow', '70');
  },
};

// ─────────────────────────────────────────────
// Тесты: Клавиатурная навигация
// ─────────────────────────────────────────────

export const ArrowRightIncreases: Story = {
  name: 'Test: ArrowRight увеличивает значение',
  args: {
    onChange: fn(),
  },
  render: (args) => ({
    components: { MkSlider },
    setup() {
      const value = ref(40);
      return { value, args };
    },
    template: `<mk-slider v-bind="args" v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper') as HTMLElement;
    button.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onChange).toHaveBeenCalledWith(41);
  },
};

export const ArrowLeftDecreases: Story = {
  name: 'Test: ArrowLeft уменьшает значение',
  args: {
    onChange: fn(),
  },
  render: (args) => ({
    components: { MkSlider },
    setup() {
      const value = ref(40);
      return { value, args };
    },
    template: `<mk-slider v-bind="args" v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper') as HTMLElement;
    button.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(args.onChange).toHaveBeenCalledWith(39);
  },
};

export const StepRespected: Story = {
  name: 'Test: ArrowRight учитывает step=10',
  args: {
    step: 10,
    onChange: fn(),
  },
  render: (args) => ({
    components: { MkSlider },
    setup() {
      const value = ref(20);
      return { value, args };
    },
    template: `<mk-slider v-bind="args" v-model="value" style="width: 400px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('.mk-slider__button-wrapper') as HTMLElement;
    button.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onChange).toHaveBeenCalledWith(30);
  },
};
