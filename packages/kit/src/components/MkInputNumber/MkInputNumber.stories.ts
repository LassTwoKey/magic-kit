import { ref } from 'vue';
import { MkSearchIcon, MkDoneIcon } from '@magic/kit/icons';
import { expect, userEvent } from 'storybook/test';

import MkInputNumber from './MkInputNumber.vue';

import type { Ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkInputNumber использует MkInput. Включает визуальные примеры, тесты структуры DOM,
 * проброса атрибутов, слотов и базовых взаимодействий.
 */
const meta = {
  title: 'Components/MkInputNumber',
  component: MkInputNumber,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    modelValue: { control: 'number' },
    precision: { control: 'number' },
    useGrouping: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
  },
} satisfies Meta<typeof MkInputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkInputNumber },
    setup() {
      const val = ref(args.modelValue);
      return { args, val };
    },
    template: `
      <mk-input-number
        v-model="val"
        v-bind="args"
        style="width: 240px"
      />
    `,
  }),
};

export const Default: Story = {
  name: 'Default',
  args: { modelValue: 1234.56 },
};

export const WithPrecision: Story = {
  name: 'Precision — 0 знаков',
  args: { modelValue: 1234, precision: 0 },
};

export const WithMinMax: Story = {
  name: 'Min / Max',
  args: { modelValue: 50, min: 0, max: 100 },
};

export const WithoutGrouping: Story = {
  name: 'Без разделителя тысяч',
  args: { modelValue: 1234567, useGrouping: false },
};

export const WithSlots: Story = {
  name: 'Slots (prefix / prepend / append)',
  render: () => ({
    components: { MkInputNumber, MkSearchIcon, MkDoneIcon },
    setup() {
      const val = ref(42);
      return { val };
    },
    template: `
      <div class="d-flex flex-column ga-2">
        <mk-input-number v-model="val">
          <template #prefixIcon><MkSearchIcon /></template>
        </mk-input-number>
        <mk-input-number v-model="val">
          <template #suffixIcon><MkDoneIcon /></template>
        </mk-input-number>
        <mk-input-number v-model="val">
          <template #prepend>
            <div class="px-3 h-100 d-flex align-center" style="background: #eee">€</div>
          </template>
          <template #append>
            <div class="px-3 h-100 d-flex align-center" style="background: #eee">RUB</div>
          </template>
        </mk-input-number>
      </div>
    `,
  }),
};

export const States: Story = {
  name: 'States',
  render: () => ({
    components: { MkInputNumber },
    setup() {
      const val = ref(100);
      return { val };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-input-number v-model="val" placeholder="Default" />
        <mk-input-number v-model="val" :invalid="true" />
        <mk-input-number v-model="val" :disabled="true" />
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasInputNumberClass: Story = {
  name: 'Test: имеет класс mk-input-number',
  args: {},
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('.mk-input-number');
    await expect(el).toBeInTheDocument();
  },
};

export const HasInputClass: Story = {
  name: 'Test: рендерит корневой mk-input',
  args: {},
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('.mk-input');
    await expect(el).toBeInTheDocument();
  },
};

export const HasInputInner: Story = {
  name: 'Test: имеет элемент input.mk-input__inner',
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input.mk-input__inner');
    await expect(input).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Проброс атрибутов (fallthrough)
// ─────────────────────────────────────────────

export const DisabledFallthrough: Story = {
  name: 'Test: disabled блокирует input через fallthrough',
  args: { disabled: true } as Story['args'],
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toBeDisabled();
  },
};

export const NotDisabledByDefault: Story = {
  name: 'Test: input активен по умолчанию',
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).not.toBeDisabled();
  },
};

export const PlaceholderFallthrough: Story = {
  name: 'Test: placeholder пробрасывается в input',
  args: { placeholder: 'Введите число' } as Story['args'],
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('placeholder', 'Введите число');
  },
};

export const InvalidFallthrough: Story = {
  name: 'Test: invalid добавляет aria-invalid и класс',
  args: { invalid: true } as Story['args'],
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    const root = canvasElement.querySelector('.mk-input');
    await expect(root).toHaveClass('mk-input--invalid');
  },
};

// ─────────────────────────────────────────────
// Кнопка очистки
// ─────────────────────────────────────────────

export const ClearButtonVisible: Story = {
  name: 'Test: clearable + modelValue показывает кнопку очистки',
  args: { clearable: true, modelValue: 100 } as Story['args'],
  play: async ({ canvasElement }) => {
    const clear = canvasElement.querySelector('.mk-input__clear');
    await expect(clear).toBeInTheDocument();
  },
};

export const ClearButtonHiddenWhenDisabled: Story = {
  name: 'Test: clearable + disabled скрывает кнопку очистки',
  args: { clearable: true, modelValue: 100, disabled: true } as Story['args'],
  play: async ({ canvasElement }) => {
    const clear = canvasElement.querySelector('.mk-input__clear');
    await expect(clear).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Слоты (проброс в MkInput)
// ─────────────────────────────────────────────

export const PrependSlotForwarded: Story = {
  name: 'Test: prepend slot пробрасывается в MkInput',
  render: () => ({
    components: { MkInputNumber },
    template: `
      <mk-input-number>
        <template #prepend><span class="test-prepend">pre</span></template>
      </mk-input-number>
    `,
  }),
  play: async ({ canvasElement }) => {
    const prepend = canvasElement.querySelector('.mk-input__prepend');
    await expect(prepend).toBeInTheDocument();
    await expect(canvasElement.querySelector('.test-prepend')).toBeInTheDocument();
  },
};

export const AppendSlotForwarded: Story = {
  name: 'Test: append slot пробрасывается в MkInput',
  render: () => ({
    components: { MkInputNumber },
    template: `
      <mk-input-number>
        <template #append><span class="test-append">app</span></template>
      </mk-input-number>
    `,
  }),
  play: async ({ canvasElement }) => {
    const append = canvasElement.querySelector('.mk-input__append');
    await expect(append).toBeInTheDocument();
    await expect(canvasElement.querySelector('.test-append')).toBeInTheDocument();
  },
};

export const PrefixIconSlotForwarded: Story = {
  name: 'Test: prefixIcon slot пробрасывается в MkInput',
  render: () => ({
    components: { MkInputNumber, MkSearchIcon },
    template: `
      <mk-input-number>
        <template #prefixIcon><MkSearchIcon /></template>
      </mk-input-number>
    `,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-input__icon');
    await expect(icon).toBeInTheDocument();
    const svg = icon?.querySelector('svg');
    await expect(svg).toBeInTheDocument();
  },
};

export const SuffixIconSlotForwarded: Story = {
  name: 'Test: suffixIcon slot пробрасывается в MkInput',
  render: () => ({
    components: { MkInputNumber, MkDoneIcon },
    template: `
      <mk-input-number>
        <template #suffixIcon><MkDoneIcon /></template>
      </mk-input-number>
    `,
  }),
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.mk-input__icon');
    await expect(icon).toBeInTheDocument();
    const svg = icon?.querySelector('svg');
    await expect(svg).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Взаимодействие
// ─────────────────────────────────────────────

export const TypingUpdatesInput: Story = {
  name: 'Test: ввод числа обновляет значение input',
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.type(input, '42');
    await expect(input.value).not.toBe('');
  },
};

export const DisabledPreventsTyping: Story = {
  name: 'Test: disabled блокирует ввод',
  args: { disabled: true } as Story['args'],
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    const before = input.value;
    await userEvent.type(input, '99');
    await expect(input.value).toBe(before);
  },
};

// ─────────────────────────────────────────────
// Expose API
// ─────────────────────────────────────────────
type TestWindow = Window & {
  __testInputNumberRef?: Ref<InstanceType<typeof MkInputNumber> | null>;
};

export const ExposedInputGetter: Story = {
  name: 'Test: expose input возвращает HTMLInputElement',
  render: () => ({
    components: { MkInputNumber },
    setup() {
      const compRef = ref<InstanceType<typeof MkInputNumber> | null>(null);
      (window as TestWindow).__testInputNumberRef = compRef;
      return { compRef };
    },
    template: `<mk-input-number ref="compRef" />`,
  }),
  play: async () => {
    const comp = (window as TestWindow).__testInputNumberRef?.value;
    await expect(comp?.input).toBeInstanceOf(HTMLInputElement);
  },
};

export const ExposedIsComposingGetter: Story = {
  name: 'Test: expose isComposing по умолчанию false',
  render: () => ({
    components: { MkInputNumber },
    setup() {
      const compRef = ref<InstanceType<typeof MkInputNumber> | null>(null);
      (window as TestWindow).__testInputNumberRef = compRef;
      return { compRef };
    },
    template: `<mk-input-number ref="compRef" />`,
  }),
  play: async () => {
    const comp = (window as TestWindow).__testInputNumberRef?.value;
    await expect(comp?.isComposing).toBe(false);
  },
};

export const ExposedFocusMethod: Story = {
  name: 'Test: expose focus() фокусирует input',
  render: () => ({
    components: { MkInputNumber },
    setup() {
      const compRef = ref<InstanceType<typeof MkInputNumber> | null>(null);
      (window as TestWindow).__testInputNumberRef = compRef;
      return { compRef };
    },
    template: `<mk-input-number ref="compRef" />`,
  }),
  play: async ({ canvasElement }) => {
    const comp = (window as TestWindow).__testInputNumberRef?.value;
    comp?.focus?.();
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveFocus();
  },
};

export const ExposedBlurMethod: Story = {
  name: 'Test: expose blur() снимает фокус с input',
  render: () => ({
    components: { MkInputNumber },
    setup() {
      const compRef = ref<InstanceType<typeof MkInputNumber> | null>(null);
      (window as TestWindow).__testInputNumberRef = compRef;
      return { compRef };
    },
    template: `<mk-input-number ref="compRef" />`,
  }),
  play: async ({ canvasElement }) => {
    const comp = (window as TestWindow).__testInputNumberRef?.value;
    comp?.focus?.();
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveFocus();
    comp?.blur?.();
    await expect(input).not.toHaveFocus();
  },
};

export const ExposedSelectMethod: Story = {
  name: 'Test: expose select() выделяет текст в input',
  render: () => ({
    components: { MkInputNumber },
    setup() {
      const val = ref(12345);
      const compRef = ref<InstanceType<typeof MkInputNumber> | null>(null);
      (window as TestWindow).__testInputNumberRef = compRef;
      return { val, compRef };
    },
    template: `<mk-input-number ref="compRef" v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const comp = (window as TestWindow).__testInputNumberRef?.value;
    comp?.focus?.();
    comp?.select?.();
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input.selectionStart).toBe(0);
    await expect(input.selectionEnd).toBe(input.value.length);
  },
};

export const ExposedClearMethod: Story = {
  name: 'Test: expose clear() очищает значение input',
  render: () => ({
    components: { MkInputNumber },
    setup() {
      const val = ref(999);
      const compRef = ref<InstanceType<typeof MkInputNumber> | null>(null);
      (window as TestWindow).__testInputNumberRef = compRef;
      return { val, compRef };
    },
    template: `<mk-input-number ref="compRef" v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input.value).not.toBe('');
    const comp = (window as TestWindow).__testInputNumberRef?.value;
    comp?.clear?.();
    await new Promise((r) => setTimeout(r, 50));
    await expect(input.value).toBe('');
  },
};
