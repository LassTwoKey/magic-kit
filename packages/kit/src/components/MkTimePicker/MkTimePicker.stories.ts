import { ref } from 'vue';
import { expect, fn, userEvent, waitFor } from 'storybook/test';

import MkTimePicker from './MkTimePicker.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkTimePicker. Компонент реализует выбор времени через скролл-колонки
 * (scroll-wheel picker) — пользователь прокручивает списки часов/минут/секунд
 * для выбора значения. Включает визуальные примеры и тесты структуры DOM,
 * классов состояний, форматов, disabled и событий.
 */
const meta = {
  title: 'Components/MkTimePicker',
  component: MkTimePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: {
      control: 'date',
    },
    format: {
      control: 'text',
    },
    valueFormat: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    enableSeconds: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
  },
  decorators: [
    () => ({
      template: '<div style="padding-bottom: 300px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MkTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Playground
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    placeholder: 'Время',
  },
  render: (args) => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value, args };
    },
    template: `<mk-time-picker v-bind="args" v-model="value" style="width: 100px" />`,
  }),
};

// ─────────────────────────────────────────────
// Базовые стори
// ─────────────────────────────────────────────

export const Basic: Story = {
  name: 'Базовый',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" placeholder="Время" style="width: 100px" />`,
  }),
};

export const WithInitialValue: Story = {
  name: 'С начальным значением',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const date = new Date();
      date.setHours(14, 30, 0, 0);
      const value = ref<Date | null>(date);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
};

export const WithPlaceholder: Story = {
  name: 'С плейсхолдером',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" placeholder="Укажите время" style="width: 100px" />`,
  }),
};

// ─────────────────────────────────────────────
// Формат
// ─────────────────────────────────────────────

export const FormatWithSeconds: Story = {
  name: 'Формат HH:mm:ss',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const date = new Date();
      date.setHours(9, 5, 30, 0);
      const value = ref<Date | null>(date);
      return { value };
    },
    template: `<mk-time-picker v-model="value" format="HH:mm:ss" style="width: 100px" />`,
  }),
};

export const ValueFormatString: Story = {
  name: 'valueFormat — строка',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<string | null>('14:30');
      const lastEmitted = ref<string | null>(null);

      const onChange = (val: string | null) => {
        lastEmitted.value = val;
      };

      return { value, lastEmitted, onChange };
    },
    template: `
      <div style="width: 100px">
        <mk-time-picker
          v-model="value"
          value-format="HH:mm"
          @change="onChange"
        />
        <p style="margin-top: 8px; font-size: 13px; color: #757575">
          v-model (string): {{ value }}
        </p>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Секунды
// ─────────────────────────────────────────────

export const WithSeconds: Story = {
  name: 'С секундами',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" enable-seconds format="HH:mm:ss" style="width: 100px" />`,
  }),
};

// ─────────────────────────────────────────────
// Очистка
// ─────────────────────────────────────────────

export const Clearable: Story = {
  name: 'С очисткой (clearable)',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const value = ref<Date | null>(date);
      return { value };
    },
    template: `<mk-time-picker v-model="value" clearable style="width: 100px" />`,
  }),
};

// ─────────────────────────────────────────────
// Ошибка
// ─────────────────────────────────────────────

export const ErrorState: Story = {
  name: 'Ошибка',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" error="Обязательное поле" placeholder="Время" style="width: 100px" />`,
  }),
};

// ─────────────────────────────────────────────
// Disabled
// ─────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Отключен',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      const value = ref<Date | null>(date);
      return { value };
    },
    template: `<mk-time-picker v-model="value" disabled style="width: 100px" />`,
  }),
};

export const DisabledEmpty: Story = {
  name: 'Отключен (пустой)',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" disabled placeholder="Недоступно" style="width: 100px" />`,
  }),
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const WithChangeEvent: Story = {
  name: 'Событие change',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      const lastChange = ref<Date | null>(null);

      const onChange = (val: Date | null) => {
        lastChange.value = val;
      };

      return { value, lastChange, onChange };
    },
    template: `
      <div style="width: 100px">
        <mk-time-picker v-model="value" @change="onChange" />
        <p style="margin-top: 8px; font-size: 13px; color: #757575">
          Текущее значение: {{ value?.toLocaleTimeString() ?? 'пусто' }}<br />
          Последний change: {{ lastChange?.toLocaleTimeString() ?? 'ещё не было' }}
        </p>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: DOM-структура
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-time-picker',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('.mk-time-picker');
    await expect(picker).toHaveClass('mk-time-picker');
  },
};

export const HasInput: Story = {
  name: 'Test: содержит input',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('.mk-input__inner');
    await expect(input).toBeInTheDocument();
  },
};

export const HasClockIcon: Story = {
  name: 'Test: содержит иконку часов',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-input__icon');
    await expect(icon).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: Модификаторы
// ─────────────────────────────────────────────

export const DisabledClass: Story = {
  name: 'Test: модификатор disabled',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" disabled style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const picker = canvasElement.querySelector('.mk-time-picker');
    await expect(picker).toHaveClass('mk-time-picker--disabled');
  },
};

// ─────────────────────────────────────────────
// Тесты: Placeholder
// ─────────────────────────────────────────────

export const PlaceholderVisible: Story = {
  name: 'Test: placeholder отображается',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" placeholder="Время" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('.mk-input__inner') as HTMLInputElement;
    await expect(input).toHaveAttribute('placeholder', 'Время');
  },
};

// ─────────────────────────────────────────────
// Тесты: Отображаемое значение
// ─────────────────────────────────────────────

export const DisplaysTime: Story = {
  name: 'Test: отображает время из modelValue',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const date = new Date();
      date.setHours(14, 30, 0, 0);
      const value = ref<Date | null>(date);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('.mk-input__inner') as HTMLInputElement;
    await expect(input.value).toBe('14:30');
  },
};

export const DisplaysCustomFormat: Story = {
  name: 'Test: отображает время с кастомным форматом',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const date = new Date();
      date.setHours(9, 5, 7, 0);
      const value = ref<Date | null>(date);
      return { value };
    },
    template: `<mk-time-picker v-model="value" format="HH:mm:ss" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('.mk-input__inner') as HTMLInputElement;
    await expect(input.value).toBe('09:05:07');
  },
};

// ─────────────────────────────────────────────
// Тесты: Dropdown
// ─────────────────────────────────────────────

export const DropdownOpensOnClick: Story = {
  name: 'Test: dropdown открывается по клику',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    await waitFor(() => {
      const dropdown = canvasElement.querySelector('.mk-time-picker__dropdown');
      void expect(dropdown).toBeVisible();
    });
  },
};

export const DropdownHasColumns: Story = {
  name: 'Test: dropdown содержит колонки часов и минут',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    const columns = canvasElement.querySelectorAll('.mk-time-picker__column');
    await expect(columns.length).toBe(2);
  },
};

export const DropdownHasSecondsColumn: Story = {
  name: 'Test: dropdown содержит 3 колонки с enableSeconds',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" enable-seconds style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    const columns = canvasElement.querySelectorAll('.mk-time-picker__column');
    await expect(columns.length).toBe(3);
  },
};

export const DropdownHasNoFooter: Story = {
  name: 'Test: dropdown не содержит кнопки',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    const footer = canvasElement.querySelector('.mk-time-picker__footer');
    await expect(footer).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: Disabled
// ─────────────────────────────────────────────

export const DisabledDoesNotOpen: Story = {
  name: 'Test: disabled не открывает dropdown',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" disabled style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    const dropdown = canvasElement.querySelector('.mk-time-picker__dropdown');
    await expect(dropdown).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: События
// ─────────────────────────────────────────────

export const EmitsChangeOnClose: Story = {
  name: 'Test: эмитит change при закрытии dropdown',
  args: {
    onChange: fn(),
  },
  render: (args) => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value, args };
    },
    template: `<mk-time-picker v-bind="args" v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement, args }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    await waitFor(() => {
      void expect(canvasElement.querySelector('.mk-time-picker__dropdown')).toBeVisible();
    });

    // Клик вне компонента закрывает dropdown и эмитит change
    await userEvent.click(document.body);
    await expect(args.onChange).toHaveBeenCalled();
  },
};

// ─────────────────────────────────────────────
// Тесты: Clearable
// ─────────────────────────────────────────────

export const ClearButtonVisible: Story = {
  name: 'Test: кнопка очистки видна при clearable и наличии значения',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      const value = ref<Date | null>(date);
      return { value };
    },
    template: `<mk-time-picker v-model="value" clearable style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const clearBtn = canvasElement.querySelector('.mk-input__clear');
    await expect(clearBtn).toBeInTheDocument();
  },
};

export const NoClearButtonWithoutValue: Story = {
  name: 'Test: нет кнопки очистки без значения',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" clearable style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const clearBtn = canvasElement.querySelector('.mk-input__clear');
    await expect(clearBtn).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: Колонки — количество элементов
// ─────────────────────────────────────────────

export const HoursColumnHas24Items: Story = {
  name: 'Test: колонка часов содержит 30 элементов (24 + 6 padding)',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    const hoursColumn = canvasElement.querySelectorAll('.mk-time-picker__column')[0];
    const items = hoursColumn.querySelectorAll('.mk-time-picker__item');
    await expect(items.length).toBe(30);
  },
};

export const MinutesColumnHas60Items: Story = {
  name: 'Test: колонка минут содержит 66 элементов (60 + 6 padding)',
  render: () => ({
    components: { MkTimePicker },
    setup() {
      const value = ref<Date | null>(null);
      return { value };
    },
    template: `<mk-time-picker v-model="value" style="width: 100px" />`,
  }),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper') as HTMLElement;
    await userEvent.click(wrapper);

    const minutesColumn = canvasElement.querySelectorAll('.mk-time-picker__column')[1];
    const items = minutesColumn.querySelectorAll('.mk-time-picker__item');
    await expect(items.length).toBe(66);
  },
};
