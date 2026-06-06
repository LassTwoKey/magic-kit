import { ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { MkPopperContent } from '@magic/kit/components/MkPopperContent';
import { MkPopperTrigger } from '@magic/kit/components/MkPopperTrigger';
import { expect, fn, userEvent } from 'storybook/test';

import MkPopper from './MkPopper.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkPopper.
 * Компонент Popper — гибкая система позиционирования, построенная на основе [@popperjs/core](https://popper.js.org/).
 * Является провайдером контекста для составных компонентов: `MkPopperTrigger`, `MkPopperContent` и `MkPopperArrow`.
 * Управляет ARIA-атрибутами (`aria-describedby`, `aria-haspopup`, `aria-controls`, `aria-expanded`)
 * в зависимости от переданного `role` и состояния открытости.
 * Поддерживает виртуальный триггер через `virtualRef` — элемент, находящийся вне дерева MkPopper.
 */
const meta = {
  title: 'Components/Tooltip/MkPopper',
  component: MkPopper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    role: {
      control: 'select',
      options: ['tooltip', 'dialog', 'menu', 'listbox', 'grid', 'group', 'navigation', 'tree'],
    },
  },
} satisfies Meta<typeof MkPopper>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { args, isOpen };
    },
    template: `
      <mk-popper v-bind="args">
        <mk-popper-trigger
          id="playground-popper"
          :open="isOpen"
          :on-mouseenter="() => (isOpen = true)"
          :on-mouseleave="() => (isOpen = false)"
        >
          <mk-button label="Hover me" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="playground-popper"
          placement="bottom"
          :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
        >
          Tooltip content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  args: {
    role: 'tooltip',
  },
};

export const RoleTooltip: Story = {
  name: 'Role: Tooltip',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger
          id="role-tooltip"
          :open="isOpen"
          :on-mouseenter="() => (isOpen = true)"
          :on-mouseleave="() => (isOpen = false)"
        >
          <mk-button label="Hover for tooltip" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="role-tooltip"
          placement="top"
          :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
        >
          I am a tooltip
        </mk-popper-content>
      </mk-popper>
    `,
  }),
};

export const RoleDialog: Story = {
  name: 'Role: Dialog',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="dialog">
        <mk-popper-trigger
          id="role-dialog"
          :open="isOpen"
          :on-click="() => (isOpen = !isOpen)"
        >
          <mk-button label="Open dialog" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="role-dialog"
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

export const RoleMenu: Story = {
  name: 'Role: Menu',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="menu">
        <mk-popper-trigger
          id="role-menu"
          :open="isOpen"
          :on-click="() => (isOpen = !isOpen)"
        >
          <mk-button label="Open menu" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="role-menu"
          placement="bottom-start"
          :popper-style="{ background: '#fff', border: '1px solid #ddd', padding: '4px 0', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,.15)', minWidth: '120px' }"
        >
          <div
            v-for="item in ['Option 1', 'Option 2', 'Option 3']"
            :key="item"
            role="menuitem"
            style="padding: 8px 16px; cursor: pointer;"
          >
            {{ item }}
          </div>
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
          label="Virtual trigger (outside MkPopper)"
          @mouseenter="isOpen = true"
          @mouseleave="isOpen = false"
        />
        <mk-popper role="tooltip">
          <mk-popper-trigger
            :virtual-ref="virtualRef"
            :virtual-triggering="true"
            id="virtual-tooltip"
            :open="isOpen"
          />
          <mk-popper-content
            :visible="isOpen"
            id="virtual-tooltip"
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
  name: 'Test: рендерит триггер и контент',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-renders" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-renders" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const btn = canvasElement.querySelector('.mk-button');
    await expect(btn).toBeInTheDocument();
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toBeInTheDocument();
  },
};

export const ContentHasRoleAndId: Story = {
  name: 'Test: content получает role и id',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-role-id" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-role-id" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    await new Promise((r) => setTimeout(r, 50));
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveAttribute('role', 'tooltip');
    await expect(content).toHaveAttribute('id', 'test-role-id');
  },
};

// ─────────────────────────────────────────────
// Тесты: ARIA атрибуты триггера
// ─────────────────────────────────────────────

export const TriggerAriaDescribedby: Story = {
  name: 'Test: trigger получает aria-describedby (role=tooltip, open=true)',
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

export const TriggerAriaDescribedbyAbsentWhenClosed: Story = {
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

export const TriggerAriaHaspopup: Story = {
  name: 'Test: trigger получает aria-haspopup и aria-controls (role=menu)',
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

export const TriggerAriaExpanded: Story = {
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
// Тесты: события MkPopperContent
// ─────────────────────────────────────────────

export const EmitsMouseenter: Story = {
  name: 'Test: content эмитит mouseenter',
  render: (args) => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-mouseenter" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="test-mouseenter"
          placement="bottom"
          @mouseenter="args['onMouseenter']"
        >
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  args: { onMouseenter: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onMouseenter = (args as Record<string, ReturnType<typeof fn>>)['onMouseenter'];
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await userEvent.hover(content);
    await expect(onMouseenter).toHaveBeenCalled();
  },
};

export const EmitsMouseleave: Story = {
  name: 'Test: content эмитит mouseleave',
  render: (args) => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { args, isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-mouseleave" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="test-mouseleave"
          placement="bottom"
          @mouseleave="args['onMouseleave']"
        >
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  args: { onMouseleave: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onMouseleave = (args as Record<string, ReturnType<typeof fn>>)['onMouseleave'];
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await userEvent.hover(content);
    await userEvent.unhover(content);
    await expect(onMouseleave).toHaveBeenCalled();
  },
};
