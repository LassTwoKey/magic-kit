import { ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { MkPopper } from '@magic/kit/components/MkPopper';
import { MkPopperContent } from '@magic/kit/components/MkPopperContent';
import { expect, fn, userEvent } from 'storybook/test';

import MkPopperTrigger from './MkPopperTrigger.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkPopperTrigger.
 * Компонент PopperTrigger — обёртка над слотом, которая пробрасывает ARIA-атрибуты
 * (`aria-describedby`, `aria-haspopup`, `aria-controls`, `aria-expanded`) на дочерний элемент
 * через `MkProxySlot`, а также цепляет обработчики событий (`onMouseenter`, `onClick` и др.)
 * напрямую через `el.addEventListener`.
 * Получает `role` и `triggerRef` из контекста `MkPopper` через `provide/inject`.
 * В режиме виртуального триггера (`virtualTriggering=true`) ничего не рендерит —
 * триггером выступает внешний элемент, переданный через `virtualRef`.
 */
const meta = {
  title: 'Components/Tooltip/MkPopperTrigger',
  component: MkPopperTrigger,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MkPopperTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const HoverTrigger: Story = {
  name: 'Hover Trigger (role: tooltip)',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger
          id="hover-trigger"
          :open="isOpen"
          :on-mouseenter="() => (isOpen = true)"
          :on-mouseleave="() => (isOpen = false)"
        >
          <mk-button label="Hover me" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="hover-trigger"
          placement="bottom"
          :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
        >
          Tooltip content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
};

export const ClickTrigger: Story = {
  name: 'Click Trigger (role: dialog)',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="dialog">
        <mk-popper-trigger
          id="click-trigger"
          :open="isOpen"
          :on-click="() => (isOpen = !isOpen)"
        >
          <mk-button label="Click me" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="click-trigger"
          placement="bottom"
          :popper-style="{ background: '#fff', border: '1px solid #ddd', padding: '16px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }"
        >
          <div style="margin-bottom: 8px;">Dialog content</div>
          <mk-button label="Close" @click="isOpen = false" />
        </mk-popper-content>
      </mk-popper>
    `,
  }),
};

export const VirtualTriggering: Story = {
  name: 'Virtual Triggering',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      const virtualRef = ref<HTMLElement | null>(null);
      return { isOpen, virtualRef };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px;">
        <mk-button
          ref="virtualRef"
          label="External trigger (outside MkPopper)"
          @mouseenter="isOpen = true"
          @mouseleave="isOpen = false"
        />
        <mk-popper role="tooltip">
          <mk-popper-trigger
            :virtual-ref="virtualRef"
            :virtual-triggering="true"
            id="virtual-trigger"
            :open="isOpen"
          />
          <mk-popper-content
            :visible="isOpen"
            id="virtual-trigger"
            placement="bottom"
            :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
          >
            Triggered from outside
          </mk-popper-content>
        </mk-popper>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: рендер и DOM
// ─────────────────────────────────────────────

export const RendersSlotContent: Story = {
  name: 'Test: рендерит слот',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-slot" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-slot" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('.mk-button');
    await expect(btn).toBeInTheDocument();
  },
};

export const VirtualTriggeringHidesSlot: Story = {
  name: 'Test: virtualTriggering=true не рендерит слот',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-virtual-hide" :open="isOpen" :virtual-triggering="true">
          <mk-button label="Should not render" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-virtual-hide" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('.mk-button');
    await expect(btn).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: ARIA-атрибуты
// ─────────────────────────────────────────────

export const AriaDescribedbyOnOpen: Story = {
  name: 'Test: aria-describedby при role=tooltip и open=true',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-describedby" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-describedby" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const btn = canvasElement.querySelector('.mk-button') as HTMLElement;
    await expect(btn).toHaveAttribute('aria-describedby', 'test-describedby');
  },
};

export const AriaDescribedbyAbsentWhenClosed: Story = {
  name: 'Test: aria-describedby отсутствует при open=false',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-describedby-closed" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-describedby-closed" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const btn = canvasElement.querySelector('.mk-button') as HTMLElement;
    await expect(btn).not.toHaveAttribute('aria-describedby');
  },
};

export const AriaHaspopupAndControls: Story = {
  name: 'Test: aria-haspopup и aria-controls при role=menu',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="menu">
        <mk-popper-trigger id="test-haspopup" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-haspopup" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const btn = canvasElement.querySelector('.mk-button') as HTMLElement;
    await expect(btn).toHaveAttribute('aria-haspopup', 'menu');
    await expect(btn).toHaveAttribute('aria-controls', 'test-haspopup');
  },
};

export const AriaExpandedReflectsOpen: Story = {
  name: 'Test: aria-expanded отражает состояние открытости',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      const toggle = () => {
        isOpen.value = !isOpen.value;
      };
      return { isOpen, toggle };
    },
    template: `
      <mk-popper role="dialog">
        <mk-popper-trigger id="test-expanded" :open="isOpen" :on-click="toggle">
          <mk-button label="Toggle" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-expanded" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const btn = canvasElement.querySelector('.mk-button') as HTMLElement;
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
  },
};

// ─────────────────────────────────────────────
// Тесты: обработчики событий
// ─────────────────────────────────────────────

export const HandlesMouseenterProp: Story = {
  name: 'Test: onMouseenter prop вызывается при наведении',
  render: (args) => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { args, isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger
          id="test-mouseenter"
          :open="isOpen"
          :on-mouseenter="args['onMouseenter']"
        >
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-mouseenter" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  args: { onMouseenter: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onMouseenter = (args as Record<string, ReturnType<typeof fn>>)['onMouseenter'];
    await new Promise((r) => setTimeout(r, 50));
    const btn = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.hover(btn);
    await expect(onMouseenter).toHaveBeenCalled();
  },
};

export const HandlesClickProp: Story = {
  name: 'Test: onClick prop вызывается при клике',
  render: (args) => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { args, isOpen };
    },
    template: `
      <mk-popper role="dialog">
        <mk-popper-trigger
          id="test-click"
          :open="isOpen"
          :on-click="args['onClick']"
        >
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-click" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  args: { onClick: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onClick = (args as Record<string, ReturnType<typeof fn>>)['onClick'];
    await new Promise((r) => setTimeout(r, 50));
    const btn = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.click(btn);
    await expect(onClick).toHaveBeenCalled();
  },
};
