import { nextTick, ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { MkTooltip } from '@magic/kit/components/MkTooltip';
import { expect, userEvent } from 'storybook/test';

import MkTooltipContent from './MkTooltipContent.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkTooltipContent.
 * Компонент TooltipContent — контейнер содержимого тултипа. Оборачивает `MkPopperContent`
 * в `MkPortal` (для телепортации) и `<Transition>` (для анимации появления/скрытия).
 * Получает `id`, `open`, `trigger` и lifecycle-колбэки из контекста `MkTooltip` через
 * `provide/inject` (`TOOLTIP_INJECTION_KEY`). Управляет видимостью через вычисляемый `shouldShow`
 * (`disabled || !open → скрыт`) и `shouldRender` (`persistent || open → в DOM`).
 * Должен всегда использоваться внутри `MkTooltip`, который обеспечивает оба контекста:
 * `TOOLTIP_INJECTION_KEY` и `POPPER_INJECTION_KEY` (через вложенный `MkPopper`).
 *
 * В stories тесты используют `MkTooltip` как враппер с `:visible="true"` для controlled-режима
 * и `:teleported="false"` чтобы контент оставался в `canvasElement` (иначе он телепортируется
 * в popper-контейнер в `document.body`).
 */
const meta = {
  title: 'Components/Tooltip/MkTooltipContent',
  component: MkTooltipContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'right',
      ],
    },
    effect: {
      control: 'select',
      options: ['dark', 'light', 'customized'],
    },
  },
} satisfies Meta<typeof MkTooltipContent>;

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
      <mk-tooltip v-bind="args">
        <mk-button label="Hover me" />
        <template #content>Tooltip content</template>
      </mk-tooltip>
    `,
  }),
  args: {
    placement: 'bottom',
    effect: 'dark',
    teleported: false,
  },
};

export const ClickTrigger: Story = {
  name: 'Click Trigger',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        trigger="click"
        placement="bottom"
        :teleported="false"
        :popper-style="{ background: '#fff', border: '1px solid #ddd', padding: '12px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }"
      >
        <mk-button label="Click me" />
        <template #content>Click-triggered content</template>
      </mk-tooltip>
    `,
  }),
};

export const PersistentMode: Story = {
  name: 'Persistent (keeps DOM when closed)',
  render: () => ({
    components: { MkTooltip, MkButton },
    setup() {
      const open = ref(false);
      return { open };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 12px;">
        <p style="font-size: 12px; color: #888; margin: 0;">
          Контент в DOM даже когда закрыт (persistent=true)
        </p>
        <mk-tooltip
          :persistent="true"
          trigger="click"
          placement="bottom"
          :teleported="false"
          :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
        >
          <mk-button label="Click to open" />
          <template #content>Persistent content</template>
        </mk-tooltip>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: видимость и состояние
// ─────────────────────────────────────────────

export const RendersWhenOpen: Story = {
  name: 'Test: контент виден при visible=true (controlled)',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        placement="bottom"
        :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
      >
        <mk-button label="Trigger" />
        <template #content>Visible content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeInTheDocument();
    await expect(content).toBeVisible();
  },
};

export const HiddenWhenClosed: Story = {
  name: 'Test: контент скрыт (v-show) при закрытом tooltip',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :persistent="true"
        :teleported="false"
        placement="bottom"
      >
        <mk-button label="Trigger" />
        <template #content>Hidden content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeInTheDocument();
    await expect(content).not.toBeVisible();
  },
};

export const DisabledHidesContent: Story = {
  name: 'Test: disabled=true не показывает контент при наведении',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :disabled="true"
        :persistent="true"
        :teleported="false"
        placement="bottom"
      >
        <mk-button label="Hover me" />
        <template #content>Should not appear</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.hover(trigger);
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeInTheDocument();
    await expect(content).not.toBeVisible();
  },
};

// ─────────────────────────────────────────────
// Тесты: классы и стили
// ─────────────────────────────────────────────

export const AlwaysHasTooltipClass: Story = {
  name: 'Test: всегда имеет класс mk-tooltip',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        placement="bottom"
      >
        <mk-button label="Trigger" />
        <template #content>Content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveClass('mk-tooltip');
  },
};

export const AppliesCustomPopperClass: Story = {
  name: 'Test: popperClass добавляет класс к контенту',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        placement="bottom"
        popper-class="my-custom-tooltip"
      >
        <mk-button label="Trigger" />
        <template #content>Content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveClass('mk-tooltip');
    await expect(content).toHaveClass('my-custom-tooltip');
  },
};

export const AppliesPopperStyle: Story = {
  name: 'Test: popperStyle применяется как inline-стиль',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        placement="bottom"
        :popper-style="{ background: 'rgb(51, 51, 51)', color: 'rgb(255, 255, 255)' }"
      >
        <mk-button label="Trigger" />
        <template #content>Styled content</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeInTheDocument();
    await expect(content.style.background).toBe('rgb(51, 51, 51)');
    await expect(content.style.color).toBe('rgb(255, 255, 255)');
  },
};

// ─────────────────────────────────────────────
// Тесты: телепортация
// ─────────────────────────────────────────────

export const TeleportedFalseRendersInCanvas: Story = {
  name: 'Test: teleported=false рендерит контент внутри canvasElement',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        placement="bottom"
      >
        <mk-button label="Trigger" />
        <template #content>
          <span class="tc-inline-content">Not teleported</span>
        </template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.tc-inline-content');
    await expect(content).toBeInTheDocument();
  },
};

export const TeleportedTrueMovesOutOfCanvas: Story = {
  name: 'Test: teleported=true перемещает контент за пределы canvasElement',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="true"
        placement="bottom"
      >
        <mk-button label="Trigger" />
        <template #content>
          <span class="tc-teleported-content">Teleported</span>
        </template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    await expect(canvasElement.querySelector('.tc-teleported-content')).toBeNull();
    await expect(document.querySelector('.tc-teleported-content')).toBeInTheDocument();
  },
};
