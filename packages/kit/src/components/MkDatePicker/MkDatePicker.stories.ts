import { MkDateRangeIcon } from '@magic/kit/icons';
import { expect } from 'storybook/test';

import MkDatePicker from './MkDatePicker.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkDatePicker. Включает визуальные примеры и тесты структуры DOM,
 * классов состояний, контента триггера и error.
 */
const meta = {
  title: 'Components/MkDatePicker',
  component: MkDatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    format: {
      control: 'text',
      description: 'Формат отображения',
    },
    disabled: {
      control: 'boolean',
    },
    range: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
    invalid: {
      control: 'boolean',
    },
    errorMessage: {
      control: 'text',
    },
  },
  decorators: [
    () => ({
      template: '<div style="padding-bottom: 370px"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MkDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    placeholder: 'Выберите дату',
  },
};

export const Range: Story = {
  name: 'Range',
  args: {
    range: true,
    placeholder: 'Выберите период',
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    disabled: true,
    placeholder: 'Недоступно',
  },
};

export const Error: Story = {
  name: 'Error',
  args: {
    invalid: true,
    errorMessage: 'Обязательное поле',
    placeholder: 'Выберите дату',
  },
};

export const WithPrefixIcon: Story = {
  name: 'Prefix icon',
  render: () => ({
    components: { MkDatePicker, MkDateRangeIcon },
    template: `<mk-datepicker placeholder="Выберите дату"><template #prefixIcon><MkDateRangeIcon /></template></mk-datepicker>`,
  }),
};

export const CustomTrigger: Story = {
  name: 'Custom trigger',
  render: () => ({
    components: { MkDatePicker },
    template: `<mk-datepicker placeholder="Кастомный триггер"><template #trigger="{ value }"><div style="padding: 8px 12px; border: 2px dashed #ccc; border-radius: 4px; cursor: pointer; font-size: 13px">{{ value || 'Нажмите' }}</div></template></mk-datepicker>`,
  }),
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    components: { MkDatePicker, MkDateRangeIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; width: 280px">
        <mk-datepicker placeholder="Default" />
        <mk-datepicker placeholder="Range" :range="true" />
        <mk-datepicker placeholder="Disabled" :disabled="true" />
        <mk-datepicker placeholder="Error" :invalid="true" error-message="Обязательное поле" />
        <mk-datepicker placeholder="С иконкой">
          <template #prefixIcon><MkDateRangeIcon /></template>
        </mk-datepicker>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-date-picker',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).toBeInTheDocument();
  },
};

export const RendersAsDiv: Story = {
  name: 'Test: рендерится как <div>',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root?.tagName.toLowerCase()).toBe('div');
  },
};

export const HasInputDropdownTrigger: Story = {
  name: 'Test: по умолчанию содержит MkInputDropdown',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-input-dropdown__inner');
    await expect(trigger).toBeInTheDocument();
  },
};

export const HasInputDropdownText: Story = {
  name: 'Test: триггер отображает placeholder',
  args: { placeholder: 'Выберите дату' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Выберите дату');
  },
};

// ─────────────────────────────────────────────
// Классы состояний
// ─────────────────────────────────────────────

export const NoDisabledClassByDefault: Story = {
  name: 'Test: нет --disabled без пропса',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).not.toHaveClass('mk-date-picker--disabled');
  },
};

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-date-picker--disabled',
  args: { disabled: true, placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).toHaveClass('mk-date-picker--disabled');
  },
};

export const NoInvalidClassByDefault: Story = {
  name: 'Test: нет --invalid без пропса',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).not.toHaveClass('mk-date-picker--invalid');
  },
};

export const InvalidClass: Story = {
  name: 'Test: invalid добавляет класс mk-date-picker--invalid',
  args: { invalid: true, placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).toHaveClass('mk-date-picker--invalid');
  },
};

export const NoInvalidWhenDisabled: Story = {
  name: 'Test: нет --invalid когда disabled',
  args: { invalid: true, disabled: true, placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).not.toHaveClass('mk-date-picker--invalid');
  },
};

export const NoRangeClassByDefault: Story = {
  name: 'Test: нет --range без пропса',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).not.toHaveClass('mk-date-picker--range');
  },
};

export const RangeClass: Story = {
  name: 'Test: range добавляет класс mk-date-picker--range',
  args: { range: true, placeholder: 'Период' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-date-picker');
    await expect(root).toHaveClass('mk-date-picker--range');
  },
};

// ─────────────────────────────────────────────
// Error
// ─────────────────────────────────────────────

export const NoErrorByDefault: Story = {
  name: 'Test: нет .mk-date-picker__error без пропса',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-date-picker__error');
    await expect(error).not.toBeInTheDocument();
  },
};

export const ErrorRenders: Story = {
  name: 'Test: errorMessage рендерит текст ошибки',
  args: { invalid: true, errorMessage: 'Обязательное поле', placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-date-picker__error');
    await expect(error).toBeInTheDocument();
    await expect(error).toHaveTextContent('Обязательное поле');
  },
};

// ─────────────────────────────────────────────
// Триггер — MkInputDropdown props
// ─────────────────────────────────────────────

export const TriggerDisabled: Story = {
  name: 'Test: disabled передаётся в MkInputDropdown',
  args: { disabled: true, placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--disabled');
  },
};

export const TriggerInvalid: Story = {
  name: 'Test: invalid передаётся в MkInputDropdown',
  args: { invalid: true, placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--invalid');
  },
};

export const TriggerDisplaysPlaceholder: Story = {
  name: 'Test: триггер отображает placeholder когда нет значения',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Дата');
  },
};

export const TriggerHasArrow: Story = {
  name: 'Test: триггер содержит стрелку',
  args: { placeholder: 'Дата' },
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-input-dropdown__arrow');
    await expect(arrow).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Custom trigger slot
// ─────────────────────────────────────────────
// Примечание: тест #trigger слота через play() не работает,
// т.к. VueDatePicker рендерит #dp-input внутри своей DOM-структуры.
// Визуальная проверка доступна в стори CustomTrigger выше.
