import { ref } from 'vue';
import { expect, fn, userEvent } from 'storybook/test';

import MkTextarea from './MkTextarea.vue';

import type { Ref } from 'vue';
import type { Size } from '@magic/kit/types';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkTextarea. Включает визуальные примеры и тесты структуры DOM,
 * классов состояний, нативных атрибутов, модификаторов v-model и событий.
 */
const meta = {
  title: 'Components/MkTextarea',
  component: MkTextarea,
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
    placeholder: { control: 'text' },
    name: { control: 'text' },
    rows: { control: 'number' },
    maxlength: { control: 'number' },
    minlength: { control: 'number' },
    tabindex: { control: 'number' },
    autosize: { control: 'boolean' },
    resize: {
      control: 'select',
      options: ['none', 'both', 'horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof MkTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkTextarea },
    setup() {
      const val = ref('');
      return { args, val };
    },
    template: `<mk-textarea v-model="val" v-bind="args" style="width: 320px" />`,
  }),
};

export const States: Story = {
  name: 'States',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-textarea v-model="val" placeholder="Default" />
        <mk-textarea v-model="val" placeholder="Disabled" :disabled="true" />
        <mk-textarea v-model="val" placeholder="Invalid" :invalid="true" />
        <mk-textarea v-model="val" placeholder="Readonly" :readonly="true" modelValue="Only read" />
      </div>
    `,
  }),
};

export const SizeVariants: Story = {
  name: 'Size',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-textarea v-model="val" placeholder="Default" />
        <mk-textarea v-model="val" placeholder="Small" size="sm" />
      </div>
    `,
  }),
};

export const AutosizeVariants: Story = {
  name: 'Autosize',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `
      <mk-textarea v-model="val" placeholder="Grows with content" :autosize="true" style="width: 320px" />
    `,
  }),
};

export const ResizeVariants: Story = {
  name: 'Resize',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `
      <div class="d-flex ga-2">
        <mk-textarea v-model="val" placeholder="none (default)" resize="none" />
        <mk-textarea v-model="val" placeholder="vertical" resize="vertical" />
        <mk-textarea v-model="val" placeholder="both" resize="both" />
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-textarea',
  args: {},
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-textarea');
    await expect(root).toBeInTheDocument();
  },
};

export const HasTextareaInner: Story = {
  name: 'Test: имеет элемент textarea.mk-textarea__inner',
  args: {},
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea.mk-textarea__inner');
    await expect(ta).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Нативные атрибуты
// ─────────────────────────────────────────────

export const PlaceholderAttr: Story = {
  name: 'Test: textarea имеет атрибут placeholder',
  args: { placeholder: 'Введите текст' },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveAttribute('placeholder', 'Введите текст');
  },
};

export const NameAttr: Story = {
  name: 'Test: textarea имеет атрибут name',
  args: { name: 'description' },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveAttribute('name', 'description');
  },
};

export const MaxlengthAttr: Story = {
  name: 'Test: textarea имеет атрибут maxlength',
  args: { maxlength: 100 },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveAttribute('maxlength', '100');
  },
};

export const MinlengthAttr: Story = {
  name: 'Test: textarea имеет атрибут minlength',
  args: { minlength: 5 },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveAttribute('minlength', '5');
  },
};

export const RowsDefault: Story = {
  name: 'Test: rows по умолчанию равен 2',
  args: {},
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveAttribute('rows', '2');
  },
};

export const RowsProp: Story = {
  name: 'Test: rows принимает кастомное значение',
  args: { rows: 5 },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveAttribute('rows', '5');
  },
};

export const TextareaDisabled: Story = {
  name: 'Test: textarea заблокирован при disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toBeDisabled();
  },
};

export const TextareaNotDisabledByDefault: Story = {
  name: 'Test: textarea активен по умолчанию',
  args: {},
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).not.toBeDisabled();
  },
};

export const TextareaReadonly: Story = {
  name: 'Test: textarea имеет readonly при readonly пропсе',
  args: { readonly: true },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveAttribute('readonly');
  },
};

export const ResizeStyle: Story = {
  name: 'Test: resize пропс применяется как style на textarea',
  args: { resize: 'vertical' },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await expect(ta).toHaveStyle({ resize: 'vertical' });
  },
};

// ─────────────────────────────────────────────
// Классы состояний
// ─────────────────────────────────────────────

export const DisabledClass: Story = {
  name: 'Test: disabled добавляет класс mk-textarea--disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-textarea');
    await expect(root).toHaveClass('mk-textarea--disabled');
  },
};

export const InvalidClass: Story = {
  name: 'Test: invalid добавляет класс mk-textarea--invalid',
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-textarea');
    await expect(root).toHaveClass('mk-textarea--invalid');
  },
};

export const SizeSmClass: Story = {
  name: 'Test: size sm добавляет класс mk-textarea--sm',
  args: { size: 'sm' },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-textarea');
    await expect(root).toHaveClass('mk-textarea--sm');
  },
};

export const FocusedClass: Story = {
  name: 'Test: focused добавляет класс mk-textarea--focused',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `<mk-textarea v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-textarea');
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.click(ta);
    await expect(root).toHaveClass('mk-textarea--focused');
  },
};

export const NoFocusedClassWhenDisabled: Story = {
  name: 'Test: disabled textarea не получает класс mk-textarea--focused',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `<mk-textarea v-model="val" :disabled="true" />`,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-textarea');
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.click(ta);
    await expect(root).not.toHaveClass('mk-textarea--focused');
  },
};

// ─────────────────────────────────────────────
// modelValue
// ─────────────────────────────────────────────

export const BindsModelValue: Story = {
  name: 'Test: modelValue отображается в textarea',
  args: { modelValue: 'Привет, мир!' },
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await expect(ta).toHaveValue('Привет, мир!');
  },
};

export const UpdatesOnInput: Story = {
  name: 'Test: значение обновляется при вводе',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `<mk-textarea v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'hello');
    await expect(ta).toHaveValue('hello');
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
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'a');
    await expect(onInput).toHaveBeenCalledWith('a');
  },
};

export const EmitsUpdateModelValue: Story = {
  name: 'Test: эмитит update:modelValue при вводе',
  args: { 'onUpdate:modelValue': fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const handler = (args as Record<string, ReturnType<typeof fn>>)['onUpdate:modelValue'];
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'z');
    await expect(handler).toHaveBeenCalledWith('z');
  },
};

export const EmitsChange: Story = {
  name: 'Test: эмитит change при потере фокуса',
  args: { onChange: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onChange } = args as { onChange: ReturnType<typeof fn> };
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'hello');
    await userEvent.tab();
    await expect(onChange).toHaveBeenCalled();
  },
};

export const EmitsFocus: Story = {
  name: 'Test: эмитит focus при получении фокуса',
  args: { onFocus: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onFocus } = args as { onFocus: ReturnType<typeof fn> };
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.click(ta);
    await expect(onFocus).toHaveBeenCalled();
  },
};

export const EmitsBlur: Story = {
  name: 'Test: эмитит blur при потере фокуса',
  args: { onBlur: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onBlur } = args as { onBlur: ReturnType<typeof fn> };
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.click(ta);
    await userEvent.tab();
    await expect(onBlur).toHaveBeenCalled();
  },
};

export const EmitsKeydown: Story = {
  name: 'Test: эмитит keydown при нажатии клавиши',
  args: { onKeydown: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onKeydown } = args as { onKeydown: ReturnType<typeof fn> };
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.click(ta);
    await userEvent.keyboard('{Enter}');
    await expect(onKeydown).toHaveBeenCalled();
  },
};

export const EmitsMouseenter: Story = {
  name: 'Test: эмитит mouseenter при наведении',
  args: { onMouseenter: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onMouseenter } = args as { onMouseenter: ReturnType<typeof fn> };
    const root = canvasElement.querySelector('.mk-textarea') as HTMLElement;
    await userEvent.hover(root);
    await expect(onMouseenter).toHaveBeenCalled();
  },
};

export const EmitsMouseleave: Story = {
  name: 'Test: эмитит mouseleave при уходе курсора',
  args: { onMouseleave: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onMouseleave } = args as { onMouseleave: ReturnType<typeof fn> };
    const root = canvasElement.querySelector('.mk-textarea') as HTMLElement;
    await userEvent.hover(root);
    await userEvent.unhover(root);
    await expect(onMouseleave).toHaveBeenCalled();
  },
};

export const NoInputWhenDisabled: Story = {
  name: 'Test: не эмитит input если disabled',
  args: { disabled: true, onInput: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onInput } = args as { onInput: ReturnType<typeof fn> };
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'test');
    await expect(onInput).not.toHaveBeenCalled();
  },
};

// ─────────────────────────────────────────────
// Модификаторы v-model
// ─────────────────────────────────────────────

export const LazyModifier: Story = {
  name: 'Test: .lazy — значение устанавливается после blur',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `<mk-textarea v-model.lazy="val" />`,
  }),
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'hello');
    await userEvent.tab();
    await expect(ta).toHaveValue('hello');
  },
};

export const TrimModifier: Story = {
  name: 'Test: .trim — обрезает пробелы вокруг значения',
  render: () => ({
    components: { MkTextarea },
    setup() {
      return { val: ref('') };
    },
    template: `<mk-textarea v-model.trim="val" />`,
  }),
  play: async ({ canvasElement }) => {
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, '  hello  ');
    // blur triggers trim normalization
    await userEvent.tab();
    await expect(ta).toHaveValue('hello');
  },
};

// ─────────────────────────────────────────────
// Expose API
// ─────────────────────────────────────────────

type TestWindow = Window & {
  __testTextareaRef?: Ref<InstanceType<typeof MkTextarea> | null>;
};

export const ExposedTextareaGetter: Story = {
  name: 'Test: expose textarea возвращает HTMLTextAreaElement',
  render: () => ({
    components: { MkTextarea },
    setup() {
      const compRef = ref<InstanceType<typeof MkTextarea> | null>(null);
      (window as TestWindow).__testTextareaRef = compRef;
      return { compRef };
    },
    template: `<mk-textarea ref="compRef" />`,
  }),
  play: async () => {
    const comp = (window as TestWindow).__testTextareaRef?.value;
    await expect(comp?.textarea).toBeInstanceOf(HTMLTextAreaElement);
  },
};

export const ExposedIsComposingGetter: Story = {
  name: 'Test: expose isComposing по умолчанию false',
  render: () => ({
    components: { MkTextarea },
    setup() {
      const compRef = ref<InstanceType<typeof MkTextarea> | null>(null);
      (window as TestWindow).__testTextareaRef = compRef;
      return { compRef };
    },
    template: `<mk-textarea ref="compRef" />`,
  }),
  play: async () => {
    const comp = (window as TestWindow).__testTextareaRef?.value;
    await expect(comp?.isComposing).toBe(false);
  },
};

export const ExposedFocusMethod: Story = {
  name: 'Test: expose focus() фокусирует textarea',
  render: () => ({
    components: { MkTextarea },
    setup() {
      const compRef = ref<InstanceType<typeof MkTextarea> | null>(null);
      (window as TestWindow).__testTextareaRef = compRef;
      return { compRef };
    },
    template: `<mk-textarea ref="compRef" />`,
  }),
  play: async ({ canvasElement }) => {
    const comp = (window as TestWindow).__testTextareaRef?.value;
    comp?.focus?.();
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveFocus();
  },
};

export const ExposedBlurMethod: Story = {
  name: 'Test: expose blur() снимает фокус с textarea',
  render: () => ({
    components: { MkTextarea },
    setup() {
      const compRef = ref<InstanceType<typeof MkTextarea> | null>(null);
      (window as TestWindow).__testTextareaRef = compRef;
      return { compRef };
    },
    template: `<mk-textarea ref="compRef" />`,
  }),
  play: async ({ canvasElement }) => {
    const comp = (window as TestWindow).__testTextareaRef?.value;
    comp?.focus?.();
    const ta = canvasElement.querySelector('textarea');
    await expect(ta).toHaveFocus();
    comp?.blur?.();
    await expect(ta).not.toHaveFocus();
  },
};

export const ExposedSelectMethod: Story = {
  name: 'Test: expose select() выделяет текст в textarea',
  render: () => ({
    components: { MkTextarea },
    setup() {
      const compRef = ref<InstanceType<typeof MkTextarea> | null>(null);
      (window as TestWindow).__testTextareaRef = compRef;
      return { val: ref('выделить меня'), compRef };
    },
    template: `<mk-textarea ref="compRef" v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const comp = (window as TestWindow).__testTextareaRef?.value;
    comp?.focus?.();
    comp?.select?.();
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await expect(ta.selectionStart).toBe(0);
    await expect(ta.selectionEnd).toBe(ta.value.length);
  },
};

export const ExposedClearMethod: Story = {
  name: 'Test: expose clear() очищает значение textarea',
  render: () => ({
    components: { MkTextarea },
    setup() {
      const compRef = ref<InstanceType<typeof MkTextarea> | null>(null);
      (window as TestWindow).__testTextareaRef = compRef;
      return { val: ref('очистить меня'), compRef };
    },
    template: `<mk-textarea ref="compRef" v-model="val" />`,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const ta = canvasElement.querySelector('textarea') as HTMLTextAreaElement;
    await expect(ta.value).not.toBe('');
    const comp = (window as TestWindow).__testTextareaRef?.value;
    comp?.clear?.();
    await new Promise((r) => setTimeout(r, 50));
    await expect(ta.value).toBe('');
  },
};
