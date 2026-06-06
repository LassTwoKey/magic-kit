import { nextTick } from 'vue';
import { MkButton } from '@magic/kit/components';
import { MkTooltip } from '@magic/kit/components/MkTooltip';
import { expect, userEvent } from 'storybook/test';

import MkTooltipTrigger from './MkTooltipTrigger.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkTooltipTrigger.
 * Компонент TooltipTrigger — обёртка над `MkPopperTrigger`, добавляющая класс `mk-tooltip-trigger`
 * и привязывающая обработчики событий (hover, click, focus, contextmenu, keydown) к коллбэкам
 * `onOpen` / `onClose` / `onToggle` из контекста `MkTooltip` (через `TOOLTIP_INJECTION_KEY`).
 * Тип триггера задаётся prop `trigger` (по умолчанию `'hover'`).
 * При `disabled=true` или `controlled=true` все обработчики отключаются через
 * `stopWhenControlledOrDisabled`. Keydown (`Enter`, `NumpadEnter`, `Space`) всегда вызывает
 * `onToggle`, независимо от `trigger` — если только не disabled/controlled.
 *
 * В stories компонент тестируется через `MkTooltip`, который является естественным провайдером
 * `TOOLTIP_INJECTION_KEY` и уже встраивает `MkTooltipTrigger` в своём шаблоне. Дефолтный слот
 * `<mk-tooltip>` рендерится внутри `MkTooltipTrigger`, поэтому `.mk-tooltip-trigger` всегда
 * оборачивает содержимое слота.
 * Для тестов используется `:teleported="false"` — чтобы контент оставался в `canvasElement`.
 * `hideAfter` по умолчанию равен 200ms, поэтому тесты на закрытие ожидают 250ms.
 */
const meta = {
  title: 'Components/Tooltip/MkTooltipTrigger',
  component: MkTooltipTrigger,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus', 'contextmenu'],
    },
    disabled: { control: 'boolean' },
    focusOnTarget: { control: 'boolean' },
  },
} satisfies Meta<typeof MkTooltipTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkTooltip, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-tooltip v-bind="args" :teleported="false">
        <mk-button label="Hover me" />
        <template #content>Tooltip content</template>
      </mk-tooltip>
    `,
  }),
  args: {
    trigger: 'hover',
    disabled: false,
  },
};

export const ClickTrigger: Story = {
  name: 'Click Trigger',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        trigger="click"
        :teleported="false"
        :popper-style="{ background: '#fff', border: '1px solid #ddd', padding: '12px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }"
      >
        <mk-button label="Click me" />
        <template #content>Click-triggered content</template>
      </mk-tooltip>
    `,
  }),
};

export const FocusTrigger: Story = {
  name: 'Focus Trigger',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        trigger="focus"
        :teleported="false"
        :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
      >
        <mk-button label="Tab to me" />
        <template #content>Focus-triggered content</template>
      </mk-tooltip>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: рендер и DOM
// ─────────────────────────────────────────────

export const RendersWithClass: Story = {
  name: 'Test: обёртка триггера имеет класс mk-tooltip-trigger',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip :teleported="false">
        <mk-button label="Trigger" />
        <template #content>Content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-tooltip-trigger');
    await expect(trigger).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: поведение триггеров
// ─────────────────────────────────────────────

export const HoverOpensAndCloses: Story = {
  name: 'Test: trigger=hover — наведение открывает, уход закрывает',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        trigger="hover"
        :persistent="true"
        :teleported="false"
        :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
      >
        <mk-button label="Hover me" />
        <template #content>Tooltip content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).not.toBeVisible();
    await userEvent.hover(trigger);
    await new Promise((r) => setTimeout(r, 50));
    await expect(content).toBeVisible();
    await userEvent.unhover(trigger);
    await new Promise((r) => setTimeout(r, 250));
    await expect(content).not.toBeVisible();
  },
};

export const ClickTogglesOpen: Story = {
  name: 'Test: trigger=click — клик открывает и закрывает',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        trigger="click"
        :persistent="true"
        :teleported="false"
        :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
      >
        <mk-button label="Click me" />
        <template #content>Click content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).not.toBeVisible();
    await userEvent.click(trigger);
    await new Promise((r) => setTimeout(r, 50));
    await expect(content).toBeVisible();
    await userEvent.click(trigger);
    await new Promise((r) => setTimeout(r, 250));
    await expect(content).not.toBeVisible();
  },
};

export const FocusOpensAndBlurCloses: Story = {
  name: 'Test: trigger=focus — фокус открывает, blur закрывает',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        trigger="focus"
        :persistent="true"
        :teleported="false"
        :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
      >
        <mk-button label="Focus me" />
        <template #content>Focus content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).not.toBeVisible();
    trigger.focus();
    await new Promise((r) => setTimeout(r, 50));
    await expect(content).toBeVisible();
    trigger.blur();
    await new Promise((r) => setTimeout(r, 250));
    await expect(content).not.toBeVisible();
  },
};

export const DisabledPreventsOpen: Story = {
  name: 'Test: disabled=true блокирует открытие при наведении',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :disabled="true"
        :persistent="true"
        :teleported="false"
      >
        <mk-button label="Hover me" />
        <template #content>Should not appear</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.hover(trigger);
    await new Promise((r) => setTimeout(r, 50));
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeInTheDocument();
    await expect(content).not.toBeVisible();
  },
};

export const ControlledIgnoresInteraction: Story = {
  name: 'Test: controlled mode (visible=true) игнорирует события триггера',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
      >
        <mk-button label="Hover me" />
        <template #content>Controlled content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeVisible();
    await userEvent.unhover(trigger);
    await new Promise((r) => setTimeout(r, 250));
    await expect(content).toBeVisible();
  },
};

export const KeydownTogglesOpen: Story = {
  name: 'Test: клавиша Enter на триггере открывает tooltip',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :persistent="true"
        :teleported="false"
        :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
      >
        <mk-button label="Focus me" />
        <template #content>Keyboard content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).not.toBeVisible();
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await new Promise((r) => setTimeout(r, 50));
    await expect(content).toBeVisible();
  },
};
