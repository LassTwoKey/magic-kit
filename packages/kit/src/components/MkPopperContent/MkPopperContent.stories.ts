import { ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { MkPopper } from '@magic/kit/components/MkPopper';
import { MkPopperArrow } from '@magic/kit/components/MkPopperArrow';
import { MkPopperTrigger } from '@magic/kit/components/MkPopperTrigger';
import { expect, fn, userEvent } from 'storybook/test';

import MkPopperContent from './MkPopperContent.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkPopperContent.
 * Компонент PopperContent — контейнер содержимого всплывающего окна, позиционируемый через [@popperjs/core](https://popper.js.org/).
 * Получает контекст (ссылку на триггер, инстанс Popper.js, роль) от родительского `MkPopper` через `provide/inject`.
 * Управляет фокусом через встроенный `MkFocusTrap` (`focusOnShow`, `trapping`, `loop`).
 * Самостоятельно устанавливает ARIA-атрибуты (`role`, `id`, `aria-modal`) на корневой div
 * или на переданный `triggerTargetEl`. Всегда должен использоваться внутри `MkPopper`.
 */
const meta = {
  title: 'Components/Tooltip/MkPopperContent',
  component: MkPopperContent,
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
    strategy: {
      control: 'select',
      options: ['fixed', 'absolute'],
    },
  },
} satisfies Meta<typeof MkPopperContent>;

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
      <mk-popper role="tooltip">
        <mk-popper-trigger
          id="playground-content"
          :open="isOpen"
          :on-mouseenter="() => (isOpen = true)"
          :on-mouseleave="() => (isOpen = false)"
        >
          <mk-button label="Hover me" />
        </mk-popper-trigger>
        <mk-popper-content
          v-bind="args"
          :visible="isOpen"
          id="playground-content"
        >
          Popper content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  args: {
    placement: 'bottom',
    popperStyle: { background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' },
  },
};

export const WithArrow: Story = {
  name: 'With Arrow',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkPopperArrow, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger
          id="with-arrow-content"
          :open="isOpen"
          :on-mouseenter="() => (isOpen = true)"
          :on-mouseleave="() => (isOpen = false)"
        >
          <mk-button label="Hover me" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="with-arrow-content"
          placement="bottom"
          :arrow-offset="5"
          :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
        >
          Tooltip with arrow
          <mk-popper-arrow />
        </mk-popper-content>
      </mk-popper>
    `,
  }),
};

export const PureMode: Story = {
  name: 'Pure Mode',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger
          id="pure-content"
          :open="isOpen"
          :on-mouseenter="() => (isOpen = true)"
          :on-mouseleave="() => (isOpen = false)"
        >
          <mk-button label="Hover me" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="pure-content"
          placement="bottom"
          :pure="true"
          :popper-style="{ background: '#333', color: '#fff', padding: '8px 12px', borderRadius: '4px' }"
        >
          Pure mode (no default padding)
        </mk-popper-content>
      </mk-popper>
    `,
  }),
};

export const FocusOnShow: Story = {
  name: 'Focus On Show (Dialog)',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="dialog">
        <mk-popper-trigger
          id="focus-on-show"
          :open="isOpen"
          :on-click="() => (isOpen = !isOpen)"
        >
          <mk-button label="Open dialog" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="focus-on-show"
          placement="bottom"
          :focus-on-show="true"
          :trapping="true"
          :popper-style="{ background: '#fff', border: '1px solid #ddd', padding: '16px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,.15)' }"
        >
          <div style="margin-bottom: 8px;">Dialog with focus trap</div>
          <mk-button label="Close" @click="isOpen = false" />
        </mk-popper-content>
      </mk-popper>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: рендер и DOM
// ─────────────────────────────────────────────

export const RendersWithClass: Story = {
  name: 'Test: рендерит div с классом mk-popper-content',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
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
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toBeInTheDocument();
    await expect(content?.tagName.toLowerCase()).toBe('div');
  },
};

export const HasTabindex: Story = {
  name: 'Test: имеет tabindex="-1"',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-tabindex" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-tabindex" placement="bottom">
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveAttribute('tabindex', '-1');
  },
};

export const AppliesRoleAndId: Story = {
  name: 'Test: получает role и id из контекста MkPopper',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="dialog">
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
    await expect(content).toHaveAttribute('role', 'dialog');
    await expect(content).toHaveAttribute('id', 'test-role-id');
  },
};

export const AppliesPopperClass: Story = {
  name: 'Test: применяет popperClass',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-popper-class" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="test-popper-class"
          placement="bottom"
          popper-class="my-custom-class"
        >
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveClass('my-custom-class');
  },
};

export const AppliesPureClass: Story = {
  name: 'Test: добавляет класс mk-popper-content--pure при pure=true',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-pure" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="test-pure"
          placement="bottom"
          :pure="true"
        >
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveClass('mk-popper-content--pure');
  },
};

export const AppliesInlineStyle: Story = {
  name: 'Test: применяет popperStyle как inline-стиль',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-style" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="test-style"
          placement="bottom"
          :popper-style="{ background: 'rgb(51, 51, 51)', color: 'rgb(255, 255, 255)' }"
        >
          Content
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeInTheDocument();
    await expect(content.style.background).toBe('rgb(51, 51, 51)');
    await expect(content.style.color).toBe('rgb(255, 255, 255)');
  },
};

// ─────────────────────────────────────────────
// Тесты: события
// ─────────────────────────────────────────────

export const EmitsMouseenter: Story = {
  name: 'Test: эмитит mouseenter',
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
  name: 'Test: эмитит mouseleave',
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
