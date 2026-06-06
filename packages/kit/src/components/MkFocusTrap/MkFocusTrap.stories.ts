import { ref } from 'vue';
import { MkButton, MkInput } from '@magic/kit/components';
import { expect, fn, userEvent } from 'storybook/test';

import MkFocusTrap from './MkFocusTrap.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkFocusTrap.
 * Компонент FocusTrap — утилита доступности, которая удерживает фокус клавиатуры внутри своего содержимого.
 * Используется в модальных окнах, диалогах и других оверлеях, где фокус не должен уходить за пределы компонента.
 * Пропс `trapped` включает/выключает ловушку, `loop` замыкает Tab-цикл (после последнего элемента фокус возвращается на первый),
 * `focusStartEl` определяет, какой элемент получает фокус при активации: `'first'`, `'last'` или `'container'`.
 */
const meta = {
  title: 'Components/MkFocusTrap',
  component: MkFocusTrap,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    trapped: { control: 'boolean' },
    loop: { control: 'boolean' },
    focusStartEl: {
      control: 'select',
      options: ['first', 'last', 'container'],
    },
  },
} satisfies Meta<typeof MkFocusTrap>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkFocusTrap, MkInput, MkButton },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { args, trapEl, val1, val2 };
    },
    template: `
      <mk-focus-trap v-bind="args" :focus-trap-el="trapEl">
        <div
          ref="trapEl"
          tabindex="-1"
          style="padding: 16px; border: 2px dashed #666; display: flex; gap: 8px; align-items: center;"
        >
          <mk-input v-model="val1" placeholder="Field 1" />
          <mk-input v-model="val2" placeholder="Field 2" />
          <mk-button label="Action" />
        </div>
      </mk-focus-trap>
    `,
  }),
  args: {
    trapped: true,
    loop: true,
  },
};

export const NotTrapped: Story = {
  name: 'Not Trapped',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { trapEl, val1, val2 };
    },
    template: `
      <mk-focus-trap :trapped="false" :focus-trap-el="trapEl">
        <div
          ref="trapEl"
          tabindex="-1"
          style="padding: 16px; border: 2px dashed #ccc; display: flex; gap: 8px;"
        >
          <mk-input v-model="val1" placeholder="Field 1" />
          <mk-input v-model="val2" placeholder="Field 2" />
        </div>
      </mk-focus-trap>
    `,
  }),
};

export const WithLoop: Story = {
  name: 'With Loop',
  render: () => ({
    components: { MkFocusTrap, MkButton },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      return { trapEl };
    },
    template: `
      <mk-focus-trap :trapped="true" :loop="true" :focus-trap-el="trapEl">
        <div
          ref="trapEl"
          tabindex="-1"
          style="padding: 16px; border: 2px dashed #4caf50; display: flex; gap: 8px;"
        >
          <mk-button label="First" />
          <mk-button label="Second" />
          <mk-button label="Last" />
        </div>
      </mk-focus-trap>
    `,
  }),
};

export const ToggleTrapped: Story = {
  name: 'Toggle Trapped',
  render: () => ({
    components: { MkFocusTrap, MkInput, MkButton },
    setup() {
      const trapped = ref(false);
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { trapped, trapEl, val1, val2 };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
        <mk-button
          :label="trapped ? 'Release trap' : 'Activate trap'"
          @click="trapped = !trapped"
        />
        <mk-focus-trap :trapped="trapped" :loop="true" :focus-trap-el="trapEl">
          <div
            ref="trapEl"
            tabindex="-1"
            style="padding: 16px; border: 2px dashed #2196f3; display: flex; gap: 8px; align-items: center;"
          >
            <mk-input v-model="val1" placeholder="Field 1" />
            <mk-input v-model="val2" placeholder="Field 2" />
            <mk-button label="OK" />
          </div>
        </mk-focus-trap>
      </div>
    `,
  }),
};

export const ScopedSlot: Story = {
  name: 'Scoped Slot (handle-keydown)',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { trapEl, val1, val2 };
    },
    template: `
      <mk-focus-trap :trapped="true" :loop="true" :focus-trap-el="trapEl">
        <template #default="{ handleKeydown }">
          <div
            ref="trapEl"
            tabindex="-1"
            style="padding: 16px; border: 2px dashed #9c27b0; display: flex; gap: 8px;"
            @keydown="handleKeydown"
          >
            <mk-input v-model="val1" placeholder="Field A" />
            <mk-input v-model="val2" placeholder="Field B" />
          </div>
        </template>
      </mk-focus-trap>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: рендер и DOM
// ─────────────────────────────────────────────

export const RendersSlotContent: Story = {
  name: 'Test: рендерит содержимое слота',
  render: () => ({
    components: { MkFocusTrap, MkButton },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      return { trapEl };
    },
    template: `
      <mk-focus-trap :trapped="false" :focus-trap-el="trapEl">
        <div ref="trapEl" tabindex="-1">
          <mk-button label="Button" />
        </div>
      </mk-focus-trap>
    `,
  }),
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('.mk-button');
    await expect(btn).toBeInTheDocument();
  },
};

export const ScopedSlotProvidesHandler: Story = {
  name: 'Test: scoped slot передаёт handle-keydown',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val = ref('');
      return { trapEl, val };
    },
    template: `
      <mk-focus-trap :trapped="false" :focus-trap-el="trapEl">
        <template #default="{ handleKeydown }">
          <div
            ref="trapEl"
            tabindex="-1"
            class="trap-container"
            @keydown="handleKeydown"
          >
            <mk-input v-model="val" placeholder="Field" />
          </div>
        </template>
      </mk-focus-trap>
    `,
  }),
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input.mk-input__inner') as HTMLInputElement;
    await expect(input).toBeInTheDocument();
    input.focus();
    await userEvent.keyboard('{Tab}');
  },
};

// ─────────────────────────────────────────────
// Тесты: фокус при активации ловушки
// ─────────────────────────────────────────────

export const FocusesFirstOnTrap: Story = {
  name: 'Test: фокусирует первый элемент при trapped=true',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { trapEl, val1, val2 };
    },
    template: `
      <mk-focus-trap :trapped="true" focus-start-el="first" :focus-trap-el="trapEl">
        <div ref="trapEl" tabindex="-1" style="display:flex; gap:8px;">
          <mk-input v-model="val1" placeholder="First" />
          <mk-input v-model="val2" placeholder="Second" />
        </div>
      </mk-focus-trap>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const inputs = canvasElement.querySelectorAll('input.mk-input__inner');
    await expect(inputs[0]).toHaveFocus();
  },
};

export const FocusesContainerOnTrap: Story = {
  name: 'Test: фокусирует контейнер при focusStartEl=container',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val = ref('');
      return { trapEl, val };
    },
    template: `
      <mk-focus-trap :trapped="true" focus-start-el="container" :focus-trap-el="trapEl">
        <div ref="trapEl" tabindex="-1" class="trap-container">
          <mk-input v-model="val" placeholder="Field" />
        </div>
      </mk-focus-trap>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const container = canvasElement.querySelector('.trap-container') as HTMLElement;
    await expect(container).toHaveFocus();
  },
};

// ─────────────────────────────────────────────
// Тесты: Tab-навигация и loop
// ─────────────────────────────────────────────

export const TabLoopsFromLastToFirst: Story = {
  name: 'Test: Tab с последнего элемента переходит на первый при loop=true',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { trapEl, val1, val2 };
    },
    template: `
      <mk-focus-trap :trapped="true" :loop="true" :focus-trap-el="trapEl">
        <div ref="trapEl" tabindex="-1" style="display:flex; gap:8px;">
          <mk-input v-model="val1" placeholder="First" />
          <mk-input v-model="val2" placeholder="Last" />
        </div>
      </mk-focus-trap>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const inputs = canvasElement.querySelectorAll('input.mk-input__inner');
    const last = inputs[inputs.length - 1] as HTMLInputElement;
    last.focus();
    await userEvent.keyboard('{Tab}');
    await expect(inputs[0]).toHaveFocus();
  },
};

export const ShiftTabLoopsFromFirstToLast: Story = {
  name: 'Test: Shift+Tab с первого элемента переходит на последний при loop=true',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { trapEl, val1, val2 };
    },
    template: `
      <mk-focus-trap :trapped="true" :loop="true" :focus-trap-el="trapEl">
        <div ref="trapEl" tabindex="-1" style="display:flex; gap:8px;">
          <mk-input v-model="val1" placeholder="First" />
          <mk-input v-model="val2" placeholder="Last" />
        </div>
      </mk-focus-trap>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const inputs = canvasElement.querySelectorAll('input.mk-input__inner');
    const first = inputs[0] as HTMLInputElement;
    first.focus();
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await expect(inputs[inputs.length - 1]).toHaveFocus();
  },
};

// ─────────────────────────────────────────────
// Тесты: события
// ─────────────────────────────────────────────

export const EmitsReleaseRequested: Story = {
  name: 'Test: эмитит release-requested при нажатии Escape',
  render: (args) => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val = ref('');
      return { args, trapEl, val };
    },
    template: `
      <mk-focus-trap
        :trapped="true"
        :loop="true"
        :focus-trap-el="trapEl"
        @release-requested="args['onRelease-requested']"
      >
        <div ref="trapEl" tabindex="-1">
          <mk-input v-model="val" placeholder="Field" />
        </div>
      </mk-focus-trap>
    `,
  }),
  args: { 'onRelease-requested': fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const handler = (args as Record<string, ReturnType<typeof fn>>)['onRelease-requested'];
    await new Promise((r) => setTimeout(r, 50));
    const input = canvasElement.querySelector('input.mk-input__inner') as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('{Escape}');
    await expect(handler).toHaveBeenCalledTimes(1);
  },
};

export const EmitsFocusin: Story = {
  name: 'Test: эмитит focusin при получении фокуса внутри ловушки',
  render: (args) => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val = ref('');
      return { args, trapEl, val };
    },
    template: `
      <mk-focus-trap
        :trapped="true"
        :focus-trap-el="trapEl"
        @focusin="args.onFocusin"
      >
        <div ref="trapEl" tabindex="-1">
          <mk-input v-model="val" placeholder="Field" />
        </div>
      </mk-focus-trap>
    `,
  }),
  args: { onFocusin: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const { onFocusin } = args as { onFocusin: ReturnType<typeof fn> };
    await new Promise((r) => setTimeout(r, 50));
    const input = canvasElement.querySelector('input.mk-input__inner') as HTMLInputElement;
    await userEvent.click(input);
    await expect(onFocusin).toHaveBeenCalled();
  },
};

export const EmitsFocusAfterTrapped: Story = {
  name: 'Test: эмитит focusAfterTrapped при активации ловушки',
  render: (args) => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val = ref('');
      return { args, trapEl, val };
    },
    template: `
      <mk-focus-trap
        :trapped="true"
        :focus-trap-el="trapEl"
        @focusAfterTrapped="args.onFocusAfterTrapped"
      >
        <div ref="trapEl" tabindex="-1">
          <mk-input v-model="val" placeholder="Field" />
        </div>
      </mk-focus-trap>
    `,
  }),
  args: { onFocusAfterTrapped: fn() } as Story['args'],
  play: async ({ args }) => {
    const { onFocusAfterTrapped } = args as { onFocusAfterTrapped: ReturnType<typeof fn> };
    await new Promise((r) => setTimeout(r, 50));
    await expect(onFocusAfterTrapped).toHaveBeenCalledTimes(1);
  },
};

// ─────────────────────────────────────────────
// Тесты: отключение ловушки
// ─────────────────────────────────────────────

export const NoTrapWhenNotTrapped: Story = {
  name: 'Test: Tab уходит за пределы при trapped=false',
  render: () => ({
    components: { MkFocusTrap, MkInput },
    setup() {
      const trapEl = ref<HTMLElement | null>(null);
      const val1 = ref('');
      const val2 = ref('');
      return { trapEl, val1, val2 };
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <mk-focus-trap :trapped="false" :loop="true" :focus-trap-el="trapEl">
          <div ref="trapEl" tabindex="-1">
            <mk-input v-model="val1" placeholder="Inside trap" />
          </div>
        </mk-focus-trap>
        <mk-input v-model="val2" placeholder="Outside trap" />
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const inputs = canvasElement.querySelectorAll('input.mk-input__inner');
    const trapInput = inputs[0] as HTMLInputElement;
    const outsideInput = inputs[1] as HTMLInputElement;
    trapInput.focus();
    await userEvent.keyboard('{Tab}');
    await expect(outsideInput).toHaveFocus();
  },
};
