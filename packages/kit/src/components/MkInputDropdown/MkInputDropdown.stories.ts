import { markRaw } from 'vue';
import { MkDateRangeIcon, MkDoneIcon } from '@magic/kit/icons';
import { expect, fn, userEvent } from 'storybook/test';

import MkInputDropdown from './MkInputDropdown.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

const meta = {
  title: 'Components/Dropdown/MkInputDropdown',
  component: MkInputDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    error: { control: 'text' },
    status: {
      control: 'select',
      options: [null, 'progress', 'good', 'bad'],
    },
    statusDot: {
      control: 'select',
      options: [null, 'progress', 'good', 'bad'],
    },
    loading: { control: 'boolean' },
    size: {
      control: 'select',
      options: [null, 'sm'],
    },
    description: { control: 'text' },
  },
} satisfies Meta<typeof MkInputDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: { placeholder: 'Выберите...' },
  render: (args) => ({
    components: { MkInputDropdown },
    setup() {
      return { args };
    },
    template: `<mk-input-dropdown v-bind="args" style="width: 300px" />`,
  }),
};

export const Default: Story = {
  name: 'Default',
  args: { modelValue: 'Выбранное значение', placeholder: 'Выберите...' },
};

export const Placeholder: Story = {
  name: 'Placeholder',
  args: { placeholder: 'Выберите...' },
};

export const WithPrefixIcon: Story = {
  name: 'Prefix icon',
  render: () => ({
    components: { MkInputDropdown, MkDateRangeIcon },
    template: `
      <mk-input-dropdown model-value="01.01.2026" style="width: 240px">
        <template #prefixIcon><MkDateRangeIcon /></template>
      </mk-input-dropdown>
    `,
  }),
};

export const WithPrefixIconProp: Story = {
  name: 'Prefix icon prop',
  render: () => ({
    components: { MkInputDropdown },
    setup() {
      return { MkDateRangeIcon: markRaw(MkDateRangeIcon) };
    },
    template: `
      <mk-input-dropdown model-value="01.01.2026" :prefix-icon="MkDateRangeIcon" style="width: 240px" />
    `,
  }),
};

export const WithSuffixContentText: Story = {
  name: 'Suffix content (text)',
  render: () => ({
    components: { MkInputDropdown },
    template: `
      <mk-input-dropdown model-value="Значение" style="width: 240px">
        <template #suffixContent>
          <span>12 Desc</span>
        </template>
      </mk-input-dropdown>
    `,
  }),
};

export const WithSuffixContentIcon: Story = {
  name: 'Suffix content (text + icon)',
  render: () => ({
    components: { MkInputDropdown, MkDoneIcon },
    template: `
      <mk-input-dropdown model-value="Значение" style="width: 240px">
        <template #suffixContent>
          <span>12 Desc</span>
          <MkDoneIcon />
        </template>
      </mk-input-dropdown>
    `,
  }),
};

export const WithSubButton: Story = {
  name: 'Sub button',
  render: () => ({
    components: { MkInputDropdown },
    template: `
      <mk-input-dropdown model-value="Значение" style="width: 240px">
        <template #subButtons>
          <span>Выбрать</span>
        </template>
      </mk-input-dropdown>
    `,
  }),
};

export const WithTwoSubButtons: Story = {
  name: 'Two sub buttons',
  render: () => ({
    components: { MkInputDropdown },
    template: `
      <mk-input-dropdown model-value="Значение" style="width: 300px">
        <template #subButtons>
          <span>Изменить</span>
          <span>Удалить</span>
        </template>
      </mk-input-dropdown>
    `,
  }),
};

export const WithThreeSubButtons: Story = {
  name: 'Three sub buttons',
  render: () => ({
    components: { MkInputDropdown },
    template: `
      <mk-input-dropdown model-value="Значение" style="width: 400px">
        <template #subButtons>
          <span>Копировать</span>
          <span>Изменить</span>
          <span>Удалить</span>
        </template>
      </mk-input-dropdown>
    `,
  }),
};

export const StatusProgress: Story = {
  name: 'Status: progress',
  args: { modelValue: 'В процессе', status: 'progress' },
};

export const StatusGood: Story = {
  name: 'Status: good',
  args: { modelValue: 'Выполнено', status: 'good' },
};

export const StatusBad: Story = {
  name: 'Status: bad',
  args: { modelValue: 'Ошибка', status: 'bad' },
};

export const StatusDotVariants: Story = {
  name: 'Status dot',
  render: () => ({
    components: { MkInputDropdown },
    template: `
      <div style="display: flex; gap: 8px; width: 600px">
        <mk-input-dropdown model-value="В процессе" status-dot="progress" />
        <mk-input-dropdown model-value="Выполнено" status-dot="good" />
        <mk-input-dropdown model-value="Ошибка" status-dot="bad" />
      </div>
    `,
  }),
};

export const StatusVariants: Story = {
  name: 'Status variants',
  render: () => ({
    components: { MkInputDropdown },
    template: `
      <div style="display: flex; gap: 8px; width: 600px">
        <mk-input-dropdown model-value="В процессе" status="progress" />
        <mk-input-dropdown model-value="Выполнено" status="good" />
        <mk-input-dropdown model-value="Ошибка" status="bad" />
      </div>
    `,
  }),
};

export const WithDescription: Story = {
  name: 'Description',
  args: { modelValue: 'Значение', description: 'Desc' },
};

export const WithError: Story = {
  name: 'Validation error',
  args: { modelValue: 'Невалидное', invalid: true, error: 'Обязательное поле' },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: { modelValue: 'Заблокировано', disabled: true },
};

export const Loading: Story = {
  name: 'Loading',
  args: { modelValue: 'Загрузка...', loading: true },
};

export const SizeSm: Story = {
  name: 'Size sm',
  args: { modelValue: 'Маленький', size: 'sm' },
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    components: { MkInputDropdown, MkDateRangeIcon, MkDoneIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 320px">
        <mk-input-dropdown model-value="Обычный" />
        <mk-input-dropdown model-value="С иконкой">
          <template #prefixIcon><MkDateRangeIcon /></template>
        </mk-input-dropdown>
        <mk-input-dropdown model-value="С суффиксом">
          <template #suffixContent>
            <span>12 Desc</span>
            <MkDoneIcon />
          </template>
        </mk-input-dropdown>
        <mk-input-dropdown model-value="Sub button">
          <template #subButtons>
            <span>Выбрать</span>
          </template>
        </mk-input-dropdown>
        <mk-input-dropdown model-value="2 кнопки">
          <template #subButtons>
            <span>Изменить</span>
            <span>Удалить</span>
          </template>
        </mk-input-dropdown>
        <mk-input-dropdown model-value="3 кнопки">
          <template #subButtons>
            <span>Копировать</span>
            <span>Изменить</span>
            <span>Удалить</span>
          </template>
        </mk-input-dropdown>
        <mk-input-dropdown model-value="В процессе" status="progress" />
        <mk-input-dropdown model-value="Выполнено" status="good" />
        <mk-input-dropdown model-value="Ошибка" status="bad" />
        <mk-input-dropdown model-value="Описание" description="Desc" />
        <mk-input-dropdown model-value="Невалидное" :invalid="true" error="Обязательное поле" />
        <mk-input-dropdown model-value="Заблокировано" :disabled="true" />
        <mk-input-dropdown model-value="Загрузка..." :loading="true" />
        <mk-input-dropdown model-value="Маленький" size="sm" />
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-input-dropdown',
  args: {},
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toBeInTheDocument();
  },
};

export const HasInnerElement: Story = {
  name: 'Test: имеет элемент .mk-input-dropdown__inner',
  args: {},
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner');
    await expect(inner).toBeInTheDocument();
  },
};

export const InnerRendersAsDiv: Story = {
  name: 'Test: inner рендерится как <div>',
  args: {},
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner');
    await expect(inner?.tagName.toLowerCase()).toBe('div');
  },
};

export const HasTextElement: Story = {
  name: 'Test: имеет элемент .mk-input-dropdown__text',
  args: { modelValue: 'Текст' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toBeInTheDocument();
    await expect(text).toHaveTextContent('Текст');
  },
};

export const HasDivider: Story = {
  name: 'Test: по умолчанию есть .mk-input-dropdown__divider',
  args: {},
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-input-dropdown__divider');
    await expect(divider).toBeInTheDocument();
  },
};

export const NoDividerWithSubButtons: Story = {
  name: 'Test: нет divider при subButtons',
  render: () => ({
    components: { MkInputDropdown },
    template: `<mk-input-dropdown model-value="Test"><template #subButtons><span>Btn</span></template></mk-input-dropdown>`,
  }),
  play: async ({ canvasElement }) => {
    const divider = canvasElement.querySelector('.mk-input-dropdown__divider');
    await expect(divider).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Текст и placeholder
// ─────────────────────────────────────────────

export const DisplaysModelValue: Story = {
  name: 'Test: отображает modelValue',
  args: { modelValue: 'Сохранено' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Сохранено');
  },
};

export const DisplaysPlaceholderWhenEmpty: Story = {
  name: 'Test: отображает placeholder при пустом modelValue',
  args: { placeholder: 'Выберите...' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Выберите...');
  },
};

export const ModelValueTakesPrecedence: Story = {
  name: 'Test: modelValue приоритетнее placeholder',
  args: { modelValue: 'Значение', placeholder: 'Подсказка' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveTextContent('Значение');
  },
};

export const PlaceholderClass: Story = {
  name: 'Test: placeholder добавляет класс mk-input-dropdown__text--placeholder',
  args: { placeholder: 'Выберите...' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).toHaveClass('mk-input-dropdown__text--placeholder');
  },
};

export const NoPlaceholderClassWithValue: Story = {
  name: 'Test: нет placeholder-класса при modelValue',
  args: { modelValue: 'Значение', placeholder: 'Подсказка' },
  play: async ({ canvasElement }) => {
    const text = canvasElement.querySelector('.mk-input-dropdown__text');
    await expect(text).not.toHaveClass('mk-input-dropdown__text--placeholder');
  },
};

// ─────────────────────────────────────────────
// Классы состояний на root
// ─────────────────────────────────────────────

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-input-dropdown--disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--disabled');
  },
};

export const DisabledInnerClass: Story = {
  name: 'Test: disabled добавляет класс mk-input-dropdown__inner--disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner');
    await expect(inner).toHaveClass('mk-input-dropdown__inner--disabled');
  },
};

export const InvalidClass: Story = {
  name: 'Test: invalid добавляет класс mk-input-dropdown--invalid',
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--invalid');
  },
};

export const InvalidInnerClass: Story = {
  name: 'Test: invalid добавляет класс mk-input-dropdown__inner--invalid',
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner');
    await expect(inner).toHaveClass('mk-input-dropdown__inner--invalid');
  },
};

export const SizeSmClass: Story = {
  name: 'Test: size sm добавляет класс mk-input-dropdown--sm',
  args: { size: 'sm' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--sm');
  },
};

// ─────────────────────────────────────────────
// Status (полоска слева)
// ─────────────────────────────────────────────

export const NoStatusByDefault: Story = {
  name: 'Test: нет .mk-input-dropdown__status без пропса',
  args: {},
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('.mk-input-dropdown__status');
    await expect(status).not.toBeInTheDocument();
  },
};

export const StatusProgressClass: Story = {
  name: 'Test: status progress добавляет классы',
  args: { status: 'progress' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--status-progress');
    const status = canvasElement.querySelector('.mk-input-dropdown__status');
    await expect(status).toHaveClass('mk-input-dropdown__status--progress');
  },
};

export const StatusGoodClass: Story = {
  name: 'Test: status good добавляет классы',
  args: { status: 'good' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--status-good');
    const status = canvasElement.querySelector('.mk-input-dropdown__status');
    await expect(status).toHaveClass('mk-input-dropdown__status--good');
  },
};

export const StatusBadClass: Story = {
  name: 'Test: status bad добавляет классы',
  args: { status: 'bad' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input-dropdown');
    await expect(root).toHaveClass('mk-input-dropdown--status-bad');
    const status = canvasElement.querySelector('.mk-input-dropdown__status');
    await expect(status).toHaveClass('mk-input-dropdown__status--bad');
  },
};

// ─────────────────────────────────────────────
// StatusDot (кружок перед текстом)
// ─────────────────────────────────────────────

export const NoStatusDotByDefault: Story = {
  name: 'Test: нет .mk-input-dropdown__status-dot без пропса',
  args: {},
  play: async ({ canvasElement }) => {
    const dot = canvasElement.querySelector('.mk-input-dropdown__status-dot');
    await expect(dot).not.toBeInTheDocument();
  },
};

export const StatusDotProgress: Story = {
  name: 'Test: statusDot progress добавляет класс',
  args: { statusDot: 'progress' },
  play: async ({ canvasElement }) => {
    const dot = canvasElement.querySelector('.mk-input-dropdown__status-dot');
    await expect(dot).toBeInTheDocument();
    await expect(dot).toHaveClass('mk-input-dropdown__status-dot--progress');
  },
};

export const StatusDotGood: Story = {
  name: 'Test: statusDot good добавляет класс',
  args: { statusDot: 'good' },
  play: async ({ canvasElement }) => {
    const dot = canvasElement.querySelector('.mk-input-dropdown__status-dot');
    await expect(dot).toHaveClass('mk-input-dropdown__status-dot--good');
  },
};

export const StatusDotBad: Story = {
  name: 'Test: statusDot bad добавляет класс',
  args: { statusDot: 'bad' },
  play: async ({ canvasElement }) => {
    const dot = canvasElement.querySelector('.mk-input-dropdown__status-dot');
    await expect(dot).toHaveClass('mk-input-dropdown__status-dot--bad');
  },
};

// ─────────────────────────────────────────────
// Description
// ─────────────────────────────────────────────

export const NoDescriptionByDefault: Story = {
  name: 'Test: нет description без пропса',
  args: {},
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-input-dropdown__description');
    await expect(desc).not.toBeInTheDocument();
  },
};

export const DescriptionRenders: Story = {
  name: 'Test: description рендерит текст',
  args: { description: 'Desc' },
  play: async ({ canvasElement }) => {
    const desc = canvasElement.querySelector('.mk-input-dropdown__description');
    await expect(desc).toBeInTheDocument();
    await expect(desc).toHaveTextContent('Desc');
  },
};

// ─────────────────────────────────────────────
// Стрелка / Preloader
// ─────────────────────────────────────────────

export const ArrowPresent: Story = {
  name: 'Test: стрелка по умолчанию присутствует',
  args: {},
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-input-dropdown__arrow');
    await expect(arrow).toBeInTheDocument();
  },
};

export const LoadingHidesArrow: Story = {
  name: 'Test: loading скрывает стрелку',
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-input-dropdown__arrow');
    await expect(arrow).not.toBeInTheDocument();
  },
};

export const LoadingShowsPreloader: Story = {
  name: 'Test: loading показывает preloader',
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const preloader = canvasElement.querySelector('.mk-input-dropdown__preloader');
    await expect(preloader).toBeInTheDocument();
  },
};

export const NoPreloaderByDefault: Story = {
  name: 'Test: нет preloader без loading',
  args: {},
  play: async ({ canvasElement }) => {
    const preloader = canvasElement.querySelector('.mk-input-dropdown__preloader');
    await expect(preloader).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Error
// ─────────────────────────────────────────────

export const NoErrorByDefault: Story = {
  name: 'Test: нет .mk-input-dropdown__error без пропса',
  args: {},
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-input-dropdown__error');
    await expect(error).not.toBeInTheDocument();
  },
};

export const ErrorRendersBelow: Story = {
  name: 'Test: error рендерит текст ошибки',
  args: { invalid: true, error: 'Обязательное поле' },
  play: async ({ canvasElement }) => {
    const error = canvasElement.querySelector('.mk-input-dropdown__error');
    await expect(error).toBeInTheDocument();
    await expect(error).toHaveTextContent('Обязательное поле');
  },
};

// ─────────────────────────────────────────────
// PrefixIcon
// ─────────────────────────────────────────────

export const NoPrefixByDefault: Story = {
  name: 'Test: нет prefix без пропса и слота',
  args: {},
  play: async ({ canvasElement }) => {
    const prefix = canvasElement.querySelector('.mk-input-dropdown__prefix');
    await expect(prefix).not.toBeInTheDocument();
  },
};

export const PrefixIconViaSlot: Story = {
  name: 'Test: prefixIcon рендерится через слот',
  render: () => ({
    components: { MkInputDropdown, MkDateRangeIcon },
    template: `<mk-input-dropdown model-value="Test"><template #prefixIcon><MkDateRangeIcon /></template></mk-input-dropdown>`,
  }),
  play: async ({ canvasElement }) => {
    const prefix = canvasElement.querySelector('.mk-input-dropdown__prefix');
    await expect(prefix).toBeInTheDocument();
  },
};

export const PrefixIconViaProp: Story = {
  name: 'Test: prefixIcon рендерится через пропс',
  render: () => ({
    components: { MkInputDropdown },
    setup() {
      return { MkDateRangeIcon: markRaw(MkDateRangeIcon) };
    },
    template: `<mk-input-dropdown model-value="Test" :prefix-icon="MkDateRangeIcon" />`,
  }),
  play: async ({ canvasElement }) => {
    const prefix = canvasElement.querySelector('.mk-input-dropdown__prefix');
    await expect(prefix).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// SuffixContent
// ─────────────────────────────────────────────

export const NoSuffixByDefault: Story = {
  name: 'Test: нет suffix без слота',
  args: {},
  play: async ({ canvasElement }) => {
    const suffix = canvasElement.querySelector('.mk-input-dropdown__suffix');
    await expect(suffix).not.toBeInTheDocument();
  },
};

export const SuffixContentRenders: Story = {
  name: 'Test: suffixContent рендерится через слот',
  render: () => ({
    components: { MkInputDropdown },
    template: `<mk-input-dropdown model-value="Test"><template #suffixContent><span>12 Desc</span></template></mk-input-dropdown>`,
  }),
  play: async ({ canvasElement }) => {
    const suffix = canvasElement.querySelector('.mk-input-dropdown__suffix');
    await expect(suffix).toBeInTheDocument();
    await expect(suffix).toHaveTextContent('12 Desc');
  },
};

// ─────────────────────────────────────────────
// SubButtons
// ─────────────────────────────────────────────

export const NoSubButtonsByDefault: Story = {
  name: 'Test: нет subButtons без слота',
  args: {},
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelector('.mk-input-dropdown__suffix-buttons');
    await expect(buttons).not.toBeInTheDocument();
  },
};

export const SubButtonsReplaceArrow: Story = {
  name: 'Test: subButtons заменяют стрелку и divider',
  render: () => ({
    components: { MkInputDropdown },
    template: `<mk-input-dropdown model-value="Test"><template #subButtons><span>Кнопка</span></template></mk-input-dropdown>`,
  }),
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-input-dropdown__arrow');
    await expect(arrow).not.toBeInTheDocument();
    const divider = canvasElement.querySelector('.mk-input-dropdown__divider');
    await expect(divider).not.toBeInTheDocument();
    const buttons = canvasElement.querySelector('.mk-input-dropdown__suffix-buttons');
    await expect(buttons).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsClick: Story = {
  name: 'Test: эмитит click при клике на inner',
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner') as HTMLElement;
    await userEvent.click(inner);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const NoClickWhenDisabled: Story = {
  name: 'Test: не эмитит click если disabled',
  args: { disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const inner = canvasElement.querySelector('.mk-input-dropdown__inner') as HTMLElement;
    await userEvent.click(inner);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
