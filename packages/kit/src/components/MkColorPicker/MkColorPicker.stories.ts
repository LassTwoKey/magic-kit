import { ref } from 'vue';
import { expect, fn } from 'storybook/test';

import MkColorPicker from './MkColorPicker.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkColorPicker. Включает визуальные примеры, тесты классов и структуры DOM,
 * состояний disabled/invalid, текста ошибки, попапа выбора цвета и событий.
 */
const meta = {
  title: 'Components/MkColorPicker',
  component: MkColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    error: {
      control: 'text',
    },
  },
  decorators: [
    () => ({
      template: '<div style="padding-bottom: 220px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MkColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Playground
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    modelValue: '#3358D4',
  },
  render: (args) => ({
    components: { MkColorPicker },
    setup() {
      const value = ref(args.modelValue as string);
      return { value, args };
    },
    template: `<mk-color-picker v-bind="args" v-model="value" style="width: 210px" />`,
  }),
};

// ─────────────────────────────────────────────
// Базовые стори
// ─────────────────────────────────────────────

export const Basic: Story = {
  name: 'Базовый',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
};

export const WithCustomColor: Story = {
  name: 'Произвольный цвет',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#42B883');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
};

// ─────────────────────────────────────────────
// Disabled
// ─────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Отключен',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#3358D4');
      return { color };
    },
    template: `<mk-color-picker v-model="color" disabled style="width: 210px" />`,
  }),
};

// ─────────────────────────────────────────────
// Ошибка
// ─────────────────────────────────────────────

export const CustomError: Story = {
  name: 'Кастомная ошибка',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" error="Цвет вне палитры" style="width: 210px" />`,
  }),
};

// ─────────────────────────────────────────────
// Тесты: DOM-структура
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-color-picker',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('.mk-color-picker');
    await expect(picker).toHaveClass('mk-color-picker');
  },
};

export const HasSwatch: Story = {
  name: 'Test: содержит swatch',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const swatch = canvasElement.querySelector('.mk-color-picker__swatch');
    await expect(swatch).toBeInTheDocument();
  },
};

export const HasInput: Story = {
  name: 'Test: содержит MkInput',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('.mk-input');
    await expect(input).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: Модификаторы
// ─────────────────────────────────────────────

export const DisabledClass: Story = {
  name: 'Test: модификатор disabled',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" disabled style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('.mk-color-picker');
    await expect(picker).toHaveClass('mk-color-picker--disabled');
  },
};

// ─────────────────────────────────────────────
// Тесты: Ошибка
// ─────────────────────────────────────────────

export const InvalidClassOnBadHex: Story = {
  name: 'Test: модификатор invalid при неверном hex',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('ZZZZZZ');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('.mk-color-picker');
    await expect(picker).toHaveClass('mk-color-picker--invalid');
  },
};

export const ErrorMessageRendered: Story = {
  name: 'Test: текст ошибки отображается',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('invalid');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-color-picker__error');
    await expect(error).toBeInTheDocument();
    await expect(error).toHaveTextContent('Неверный формат цвета');
  },
};

export const CustomErrorRendered: Story = {
  name: 'Test: кастомная ошибка отображается',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" error="Цвет вне палитры" style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-color-picker__error');
    await expect(error).toBeInTheDocument();
    await expect(error).toHaveTextContent('Цвет вне палитры');
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
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color, args };
    },
    template: `<mk-color-picker v-bind="args" v-model="color" style="width: 210px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    input.focus();
    input.value = '#00FF00';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await expect(args.onChange).toHaveBeenCalledWith('#00FF00');
  },
};

// ─────────────────────────────────────────────
// Попап
// ─────────────────────────────────────────────

export const PopupColorPicker: Story = {
  name: 'Попап выбора цвета',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF5500');
      return { color };
    },
    template: `
      <div style="width: 210px">
        <mk-color-picker v-model="color" />
        <p style="margin-top: 16px; font-size: 13px; color: #757575">
          Текущий цвет: {{ color }}
        </p>
      </div>
    `,
  }),
};

export const PopupDisabled: Story = {
  name: 'Попап отключен',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#3358D4');
      return { color };
    },
    template: `<mk-color-picker v-model="color" disabled style="width: 210px" />`,
  }),
};

// ─────────────────────────────────────────────
// Тесты: Попап
// ─────────────────────────────────────────────

export const HasSwatchCursor: Story = {
  name: 'Test: swatch имеет cursor pointer',
  render: () => ({
    components: { MkColorPicker },
    setup() {
      const color = ref('#FF0000');
      return { color };
    },
    template: `<mk-color-picker v-model="color" style="width: 210px" />`,
  }),
  play: async ({ canvasElement }) => {
    const swatch = canvasElement.querySelector('.mk-color-picker__swatch') as HTMLElement;
    await expect(getComputedStyle(swatch).cursor).toBe('pointer');
  },
};
