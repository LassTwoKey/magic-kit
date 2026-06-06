import { markRaw, ref } from 'vue';
import { MkCloseIcon, MkDoneIcon, MkSearchIcon } from '@magic/kit/icons';
import { expect, fn, userEvent } from 'storybook/test';

import MkInput from './MkInput.vue';

import type { Ref } from 'vue';
import type { Size } from '@magic/kit/types';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkInput. Включает визуальные примеры, тесты классов и структуры DOM,
 * атрибутов нативного input, состояний, кнопки очистки, слотов и событий.
 */
const meta = {
  title: 'Components/MkInput',
  component: MkInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'] satisfies Size[],
    },
    modelValue: { control: 'text' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    invalid: { control: 'boolean' },
    clearable: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: { control: 'text' },
    name: { control: 'text' },
    maxlength: { control: 'number' },
    minlength: { control: 'number' },
    tabindex: { control: 'number' },
    autocomplete: { control: 'text' },
    prepend: {
      table: { type: { summary: 'Slot' }, category: 'Slots', defaultValue: { summary: '—' } },
      description: 'Слот для блока перед полем ввода',
    },
    append: {
      table: { type: { summary: 'Slot' }, category: 'Slots', defaultValue: { summary: '—' } },
      description: 'Слот для блока после поля ввода',
    },
    clearIcon: {
      table: { type: { summary: 'Slot' }, category: 'Slots', defaultValue: { summary: '—' } },
      description: 'Слот иконки кнопки очистки',
    },
    prefixIcon: {
      table: { type: { summary: 'Slot' }, category: 'Slots', defaultValue: { summary: '—' } },
      description: 'Слот иконки перед полем ввода',
    },
    suffixIcon: {
      table: { type: { summary: 'Slot' }, category: 'Slots', defaultValue: { summary: '—' } },
      description: 'Слот иконки после поля ввода',
    },
  },
} satisfies Meta<typeof MkInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkInput },
    setup() {
      const val = ref('');
      return { args, val };
    },
    template: `<mk-input v-model="val" v-bind="args" style="width: 240px" />`,
  }),
};

export const Default: Story = {
  args: { placeholder: 'Введите значение' },
};

export const Disabled: Story = {
  args: { placeholder: 'Отключён', disabled: true },
};

export const Readonly: Story = {
  args: { modelValue: 'Только чтение', readonly: true },
};

export const Invalid: Story = {
  args: { modelValue: 'Ошибка', invalid: true },
};

export const Clearable: Story = {
  args: { modelValue: 'Очисти меня', clearable: true },
};

export const SizeVariants: Story = {
  name: 'Size',
  render: () => ({
    components: { MkInput, MkDoneIcon },
    setup() {
      const val = ref('');
      return { val };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-input v-model="val" placeholder="Default">
          <template #prefixIcon><MkDoneIcon /></template>
        </mk-input>
        <mk-input v-model="val" placeholder="Small" size="sm">
          <template #prefixIcon><MkDoneIcon /></template>
        </mk-input>
      </div>
    `,
  }),
};

export const StatesVariants: Story = {
  name: 'States',
  render: () => ({
    components: { MkInput },
    setup() {
      const val = ref('');
      return { val };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-input v-model="val" placeholder="Default" />
        <mk-input v-model="val" placeholder="Invalid" :invalid="true" />
        <mk-input v-model="val" placeholder="Disabled" :disabled="true" />
      </div>
    `,
  }),
};

export const ClearVariants: Story = {
  name: 'Clear',
  render: () => ({
    components: { MkInput, MkCloseIcon },
    setup() {
      const val = ref('Почисть меня');
      const val2 = ref('Почисть меня');
      return { val, val2 };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-input v-model="val" :clearable="true" />
        <mk-input v-model="val2" :clearable="true">
          <template #suffixIcon><MkCloseIcon /></template>
        </mk-input>
      </div>
    `,
  }),
};

export const IconsVariants: Story = {
  name: 'Icons',
  render: () => ({
    components: { MkInput, MkSearchIcon, MkDoneIcon },
    setup() {
      const val = ref('');
      return { val };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-input v-model="val" placeholder="Prefix">
          <template #prefixIcon><MkSearchIcon /></template>
        </mk-input>
        <mk-input v-model="val" placeholder="Suffix">
          <template #suffixIcon><MkDoneIcon /></template>
        </mk-input>
        <mk-input v-model="val" placeholder="Both">
          <template #prefixIcon><MkSearchIcon /></template>
          <template #suffixIcon><MkDoneIcon /></template>
        </mk-input>
      </div>
    `,
  }),
};

export const IconsPropsVariants: Story = {
  name: 'Icons props',
  render: () => ({
    components: { MkInput, MkSearchIcon, MkDoneIcon },
    setup() {
      const val = ref('');
      return { val, MkSearchIcon: markRaw(MkSearchIcon), MkDoneIcon: markRaw(MkDoneIcon) };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-input v-model="val" placeholder="Prefix" :prefixIcon="MkSearchIcon" />
        <mk-input v-model="val" placeholder="Suffix" :suffixIcon="MkDoneIcon" />
        <mk-input v-model="val" placeholder="Both" :prefixIcon="MkSearchIcon" :suffixIcon="MkDoneIcon" />
      </div>
    `,
  }),
};

export const SlotsVariants: Story = {
  name: 'Slots',
  render: () => ({
    components: { MkInput },
    setup() {
      const val = ref('');
      return { val };
    },
    template: `
      <div class="d-flex ga-2 mb-2">
        <mk-input v-model="val" placeholder="Со слотами">
          <template #prepend>
            <div class="px-3 h-100 d-flex align-center" style="background: #eee">Prepend</div>
          </template>
          <template #append>
            <div class="px-3 h-100 d-flex align-center" style="background: #eee">Append</div>
          </template>
        </mk-input>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-input',
  args: {},
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input');
    await expect(root).toBeInTheDocument();
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

export const InputTypeText: Story = {
  name: 'Test: input по умолчанию имеет type="text"',
  args: {},
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('type', 'text');
  },
};

// ─────────────────────────────────────────────
// Атрибуты нативного input
// ─────────────────────────────────────────────

export const PlaceholderAttr: Story = {
  name: 'Test: input имеет атрибут placeholder',
  args: { placeholder: 'Введите значение' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('placeholder', 'Введите значение');
  },
};

export const NameAttr: Story = {
  name: 'Test: input имеет атрибут name',
  args: { name: 'username' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('name', 'username');
  },
};

export const MaxlengthAttr: Story = {
  name: 'Test: input имеет атрибут maxlength',
  args: { maxlength: 10 },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('maxlength', '10');
  },
};

export const TypePassword: Story = {
  name: 'Test: input имеет type="password" из пропса',
  args: { type: 'password' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('type', 'password');
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

export const InputReadonly: Story = {
  name: 'Test: input имеет readonly при readonly пропсе',
  args: { readonly: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('readonly');
  },
};

export const AriaInvalidAttr: Story = {
  name: 'Test: input имеет aria-invalid при invalid',
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

// ─────────────────────────────────────────────
// Классы состояний
// ─────────────────────────────────────────────

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-input--disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input');
    await expect(root).toHaveClass('mk-input--disabled');
  },
};

export const InvalidClass: Story = {
  name: 'Test: invalid добавляет класс mk-input--invalid',
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input');
    await expect(root).toHaveClass('mk-input--invalid');
  },
};

export const SizeSmClass: Story = {
  name: 'Test: size sm добавляет класс mk-input--sm',
  args: { size: 'sm' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-input');
    await expect(root).toHaveClass('mk-input--sm');
  },
};

export const WrapperInvalidClass: Story = {
  name: 'Test: invalid добавляет класс mk-input__wrapper--invalid',
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('.mk-input__wrapper');
    await expect(wrapper).toHaveClass('mk-input__wrapper--invalid');
  },
};

// ─────────────────────────────────────────────
// Кнопка очистки
// ─────────────────────────────────────────────

export const ClearButtonVisible: Story = {
  name: 'Test: clearable + value показывает кнопку очистки',
  args: { clearable: true, modelValue: 'текст' },
  play: async ({ canvasElement }) => {
    const clear = canvasElement.querySelector('.mk-input__clear');
    await expect(clear).toBeInTheDocument();
  },
};

export const ClearButtonHiddenWhenEmpty: Story = {
  name: 'Test: clearable + пустое значение скрывает кнопку очистки',
  args: { clearable: true, modelValue: '' },
  play: async ({ canvasElement }) => {
    const clear = canvasElement.querySelector('.mk-input__clear');
    await expect(clear).not.toBeInTheDocument();
  },
};

export const ClearButtonHiddenWhenDisabled: Story = {
  name: 'Test: clearable + disabled скрывает кнопку очистки',
  args: { clearable: true, modelValue: 'текст', disabled: true },
  play: async ({ canvasElement }) => {
    const clear = canvasElement.querySelector('.mk-input__clear');
    await expect(clear).not.toBeInTheDocument();
  },
};

export const ClearButtonHiddenWhenReadonly: Story = {
  name: 'Test: clearable + readonly скрывает кнопку очистки',
  args: { clearable: true, modelValue: 'текст', readonly: true },
  play: async ({ canvasElement }) => {
    const clear = canvasElement.querySelector('.mk-input__clear');
    await expect(clear).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Слоты
// ─────────────────────────────────────────────

export const PrependSlotRenders: Story = {
  name: 'Test: prepend slot рендерится',
  render: () => ({
    components: { MkInput },
    template: `
      <mk-input>
        <template #prepend><span class="test-prepend">pre</span></template>
      </mk-input>
    `,
  }),
  play: async ({ canvasElement }) => {
    const prepend = canvasElement.querySelector('.mk-input__prepend');
    await expect(prepend).toBeInTheDocument();
    await expect(canvasElement.querySelector('.test-prepend')).toBeInTheDocument();
  },
};

export const AppendSlotRenders: Story = {
  name: 'Test: append slot рендерится',
  render: () => ({
    components: { MkInput },
    template: `
      <mk-input>
        <template #append><span class="test-append">app</span></template>
      </mk-input>
    `,
  }),
  play: async ({ canvasElement }) => {
    const append = canvasElement.querySelector('.mk-input__append');
    await expect(append).toBeInTheDocument();
    await expect(canvasElement.querySelector('.test-append')).toBeInTheDocument();
  },
};

export const NoPrependWithoutSlot: Story = {
  name: 'Test: нет .mk-input__prepend без слота',
  args: {},
  play: async ({ canvasElement }) => {
    const prepend = canvasElement.querySelector('.mk-input__prepend');
    await expect(prepend).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// События
// ─────────────────────────────────────────────

export const EmitsInput: Story = {
  name: 'Test: эмитит input при вводе',
  args: { onInput: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onInput } = args as { onInput: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'a');
    await expect(onInput).toHaveBeenCalledWith('a');
  },
};

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при вводе',
  args: { 'onUpdate:modelValue': fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const handler = (args as Record<string, ReturnType<typeof fn>>)['onUpdate:modelValue'];
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'z');
    await expect(handler).toHaveBeenCalledWith('z');
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при потере фокуса',
  args: { onChange: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'hello');
    await userEvent.tab();
    await expect(onChange).toHaveBeenCalled();
  },
};

export const EmitsFocus: Story = {
  name: 'Test: эмитит focus при получении фокуса',
  args: { onFocus: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onFocus } = args as { onFocus: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(onFocus).toHaveBeenCalled();
  },
};

export const EmitsBlur: Story = {
  name: 'Test: эмитит blur при потере фокуса',
  args: { onBlur: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onBlur } = args as { onBlur: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.tab();
    await expect(onBlur).toHaveBeenCalled();
  },
};

export const EmitsClear: Story = {
  name: 'Test: эмитит clear при клике на кнопку очистки',
  args: { clearable: true, modelValue: 'текст', onClear: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onClear } = args as { onClear: ReturnType<typeof fn> };
    const clearBtn = canvasElement.querySelector('.mk-input__clear') as HTMLElement;
    await expect(clearBtn).toBeInTheDocument();
    await userEvent.click(clearBtn);
    await expect(onClear).toHaveBeenCalledTimes(1);
  },
};

export const NoInputWhenDisabled: Story = {
  name: 'Test: не эмитит input если disabled',
  args: { disabled: true, onInput: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onInput } = args as { onInput: ReturnType<typeof fn> };
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'test');
    await expect(onInput).not.toHaveBeenCalled();
  },
};

export const TogglesValueOnInput: Story = {
  name: 'Test: значение обновляется при вводе',
  render: () => ({
    components: { MkInput },
    setup() {
      const val = ref('');
      return { val };
    },
    template: `<mk-input v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'hello');
    await expect(input).toHaveValue('hello');
  },
};

// ─────────────────────────────────────────────
// Expose API
// ─────────────────────────────────────────────
type TestWindow = Window & {
  __testInputRef?: Ref<InstanceType<typeof MkInput> | null>;
};

export const ExposedInputGetter: Story = {
  name: 'Test: expose input возвращает HTMLInputElement',
  render: () => ({
    components: { MkInput },
    setup() {
      const compRef = ref<InstanceType<typeof MkInput> | null>(null);
      (window as TestWindow).__testInputRef = compRef;
      return { compRef };
    },
    template: `<mk-input ref="compRef" />`,
  }),
  play: async () => {
    const comp = (window as TestWindow).__testInputRef?.value;
    await expect(comp?.input).toBeInstanceOf(HTMLInputElement);
  },
};

export const ExposedIsComposingGetter: Story = {
  name: 'Test: expose isComposing по умолчанию false',
  render: () => ({
    components: { MkInput },
    setup() {
      const compRef = ref<InstanceType<typeof MkInput> | null>(null);
      (window as TestWindow).__testInputRef = compRef;
      return { compRef };
    },
    template: `<mk-input ref="compRef" />`,
  }),
  play: async () => {
    const comp = (window as TestWindow).__testInputRef?.value;
    await expect(comp?.isComposing).toBe(false);
  },
};

export const ExposedFocusMethod: Story = {
  name: 'Test: expose focus() фокусирует input',
  render: () => ({
    components: { MkInput },
    setup() {
      const compRef = ref<InstanceType<typeof MkInput> | null>(null);
      (window as TestWindow).__testInputRef = compRef;
      return { compRef };
    },
    template: `<mk-input ref="compRef" />`,
  }),
  play: async ({ canvasElement }) => {
    const comp = (window as TestWindow).__testInputRef?.value;
    comp?.focus?.();
    const input = canvasElement.querySelector('input');
    await expect(input).toHaveFocus();
  },
};

export const ExposedBlurMethod: Story = {
  name: 'Test: expose blur() снимает фокус с input',
  render: () => ({
    components: { MkInput },
    setup() {
      const compRef = ref<InstanceType<typeof MkInput> | null>(null);
      (window as TestWindow).__testInputRef = compRef;
      return { compRef };
    },
    template: `<mk-input ref="compRef" />`,
  }),
  play: async ({ canvasElement }) => {
    const comp = (window as TestWindow).__testInputRef?.value;
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
    components: { MkInput },
    setup() {
      const val = ref(12345);
      const compRef = ref<InstanceType<typeof MkInput> | null>(null);
      (window as TestWindow).__testInputRef = compRef;
      return { val, compRef };
    },
    template: `<mk-input ref="compRef" v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const comp = (window as TestWindow).__testInputRef?.value;
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
    components: { MkInput },
    setup() {
      const val = ref(999);
      const compRef = ref<InstanceType<typeof MkInput> | null>(null);
      (window as TestWindow).__testInputRef = compRef;
      return { val, compRef };
    },
    template: `<mk-input ref="compRef" v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await expect(input.value).not.toBe('');
    const comp = (window as TestWindow).__testInputRef?.value;
    comp?.clear?.();
    await new Promise((r) => setTimeout(r, 50));
    await expect(input.value).toBe('');
  },
};
