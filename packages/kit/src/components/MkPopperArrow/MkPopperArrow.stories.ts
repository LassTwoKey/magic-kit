import { provide, ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { MkPopper } from '@magic/kit/components/MkPopper';
import { MkPopperContent } from '@magic/kit/components/MkPopperContent';
import { MkPopperTrigger } from '@magic/kit/components/MkPopperTrigger';
import { POPPER_CONTENT_INJECTION_KEY } from '@magic/kit/constants';
import { expect } from 'storybook/test';

import MkPopperArrow from './MkPopperArrow.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkPopperArrow.
 * Компонент PopperArrow — стрелка-индикатор позиционирования, которая используется внутри `MkPopperContent`.
 * Получает координаты и стиль через `provide/inject` (`POPPER_CONTENT_INJECTION_KEY`) от родительского `MkPopperContent`,
 * который в свою очередь вычисляет их с помощью модификатора `arrow` из [@popperjs/core](https://popper.js.org/).
 * Рендерится как `<span data-popper-arrow />` — нужный атрибут для автоматического определения стрелки Popper.js.
 */
const meta = {
  title: 'Components/Tooltip/MkPopperArrow',
  component: MkPopperArrow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MkPopperArrow>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Standalone: Story = {
  name: 'Standalone (без контекста)',
  render: () => ({
    components: { MkPopperArrow },
    setup() {
      return {};
    },
    template: `
      <div style="position: relative; width: 80px; height: 40px; background: #333; border-radius: 4px;">
        <mk-popper-arrow />
      </div>
    `,
  }),
};

export const WithInjectedStyle: Story = {
  name: 'С инжектированным стилем',
  render: () => ({
    components: { MkPopperArrow },
    setup() {
      provide(POPPER_CONTENT_INJECTION_KEY, {
        arrowRef: ref<HTMLElement | undefined>(),
        arrowStyle: ref({ bottom: '-5px', left: '50%', transform: 'translateX(-50%)' }),
      });
      return {};
    },
    template: `
      <div style="position: relative; width: 120px; height: 40px; background: #333; border-radius: 4px;">
        <mk-popper-arrow />
      </div>
    `,
  }),
};

export const InsidePopper: Story = {
  name: 'Внутри MkPopper',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkPopperArrow, MkButton },
    setup() {
      const isOpen = ref(false);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger
          id="arrow-tooltip"
          :open="isOpen"
          :on-mouseenter="() => (isOpen = true)"
          :on-mouseleave="() => (isOpen = false)"
        >
          <mk-button label="Hover me" />
        </mk-popper-trigger>
        <mk-popper-content
          :visible="isOpen"
          id="arrow-tooltip"
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

// ─────────────────────────────────────────────
// Тесты: рендер и DOM
// ─────────────────────────────────────────────

export const RendersWithClass: Story = {
  name: 'Test: рендерит span с классом mk-popper-arrow',
  render: () => ({
    components: { MkPopperArrow },
    template: `<mk-popper-arrow />`,
  }),
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-popper-arrow');
    await expect(arrow).toBeInTheDocument();
    await expect(arrow?.tagName.toLowerCase()).toBe('span');
  },
};

export const HasDataAttribute: Story = {
  name: 'Test: имеет атрибут data-popper-arrow',
  render: () => ({
    components: { MkPopperArrow },
    template: `<mk-popper-arrow />`,
  }),
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-popper-arrow');
    await expect(arrow).toHaveAttribute('data-popper-arrow');
  },
};

export const AppliesInjectedStyle: Story = {
  name: 'Test: применяет стиль из инжектированного контекста',
  render: () => ({
    components: { MkPopperArrow },
    setup() {
      provide(POPPER_CONTENT_INJECTION_KEY, {
        arrowRef: ref<HTMLElement | undefined>(),
        arrowStyle: ref({ top: '42px', left: '7px' }),
      });
      return {};
    },
    template: `<div style="position:relative;"><mk-popper-arrow /></div>`,
  }),
  play: async ({ canvasElement }) => {
    const arrow = canvasElement.querySelector('.mk-popper-arrow') as HTMLElement;
    await expect(arrow).toBeInTheDocument();
    await expect(arrow.style.top).toBe('42px');
    await expect(arrow.style.left).toBe('7px');
  },
};

export const InsidePopperContent: Story = {
  name: 'Test: arrow находится в DOM внутри MkPopperContent',
  render: () => ({
    components: { MkPopper, MkPopperTrigger, MkPopperContent, MkPopperArrow, MkButton },
    setup() {
      const isOpen = ref(true);
      return { isOpen };
    },
    template: `
      <mk-popper role="tooltip">
        <mk-popper-trigger id="test-arrow-dom" :open="isOpen">
          <mk-button label="Trigger" />
        </mk-popper-trigger>
        <mk-popper-content :visible="isOpen" id="test-arrow-dom" placement="bottom">
          Content
          <mk-popper-arrow />
        </mk-popper-content>
      </mk-popper>
    `,
  }),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toBeInTheDocument();
    const arrow = content?.querySelector('.mk-popper-arrow');
    await expect(arrow).toBeInTheDocument();
    await expect(arrow).toHaveAttribute('data-popper-arrow');
  },
};
