import { MkButton } from '@magic/kit/components';
import { expect } from 'storybook/test';

import MkProxySlot from './MkProxySlot.jsx';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkProxySlot.
 * Утилитарный компонент — «прозрачная прокси-обёртка».
 * Берёт единственный дочерний элемент из default-слота, клонирует его через `cloneVNode`,
 * прокидывает все `$attrs` и привязывает `forwardRef`-директиву.
 * Не создаёт собственного DOM-узла.
 *
 * Используется внутри `MkPopperTrigger` для передачи ARIA-атрибутов и ref
 * на реальный элемент триггера.
 */
const meta = {
  title: 'Components/Tooltip/MkProxySlot',
  component: MkProxySlot,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MkProxySlot>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const WithButton: Story = {
  name: 'С кнопкой',
  render: () => ({
    components: { MkProxySlot, MkButton },
    template: `<mk-proxy-slot><mk-button label="Кнопка" /></mk-proxy-slot>`,
  }),
};

export const WithSpan: Story = {
  name: 'С произвольным элементом',
  render: () => ({
    components: { MkProxySlot },
    template: `<mk-proxy-slot><span style="padding: 4px 12px; border: 1px solid #999;">Span</span></mk-proxy-slot>`,
  }),
};

export const ForwardsAttributes: Story = {
  name: 'Проброс атрибутов',
  render: () => ({
    components: { MkProxySlot, MkButton },
    template: `<mk-proxy-slot class="custom-class" data-testid="proxied"><mk-button label="Кнопка" /></mk-proxy-slot>`,
  }),
};

// ─────────────────────────────────────────────
// Тесты: рендер дочернего элемента
// ─────────────────────────────────────────────

export const RendersChild: Story = {
  name: 'Test: рендерит дочерний элемент',
  render: () => ({
    components: { MkProxySlot, MkButton },
    template: `<mk-proxy-slot><mk-button label="Child" /></mk-proxy-slot>`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-button');
    await expect(button).toBeInTheDocument();
  },
};

export const RendersFirstChildOnly: Story = {
  name: 'Test: рендерит только первый дочерний элемент',
  render: () => ({
    components: { MkProxySlot, MkButton },
    template: `
      <mk-proxy-slot>
        <mk-button label="First" />
        <mk-button label="Second" />
      </mk-proxy-slot>
    `,
  }),
  play: async ({ canvasElement }) => {
    const buttons = canvasElement.querySelectorAll('.mk-button');
    await expect(buttons.length).toBe(1);
    await expect(buttons[0]).toHaveTextContent('First');
  },
};

// ─────────────────────────────────────────────
// Тесты: проброс атрибутов
// ─────────────────────────────────────────────

export const ForwardsClass: Story = {
  name: 'Test: пробрасывает class на дочерний элемент',
  render: () => ({
    components: { MkProxySlot, MkButton },
    template: `<mk-proxy-slot class="injected-class"><mk-button label="Btn" /></mk-proxy-slot>`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-button');
    await expect(button).toHaveClass('injected-class');
  },
};

export const ForwardsDataAttribute: Story = {
  name: 'Test: пробрасывает data-атрибуты',
  render: () => ({
    components: { MkProxySlot, MkButton },
    template: `<mk-proxy-slot data-testid="forwarded"><mk-button label="Btn" /></mk-proxy-slot>`,
  }),
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('.mk-button');
    await expect(button).toHaveAttribute('data-testid', 'forwarded');
  },
};

// ─────────────────────────────────────────────
// Тесты: текстовое содержимое
// ─────────────────────────────────────────────

export const WrapsTextInSpan: Story = {
  name: 'Test: оборачивает текст в span',
  render: () => ({
    components: { MkProxySlot },
    template: `<mk-proxy-slot>Текст</mk-proxy-slot>`,
  }),
  play: async ({ canvasElement }) => {
    const span = canvasElement.querySelector('span');
    await expect(span).toBeInTheDocument();
    await expect(span).toHaveTextContent('Текст');
  },
};

// ─────────────────────────────────────────────
// Тесты: пустой слот
// ─────────────────────────────────────────────

export const EmptySlotRendersNothing: Story = {
  name: 'Test: пустой слот не рендерит ничего',
  render: () => ({
    components: { MkProxySlot },
    template: `<mk-proxy-slot></mk-proxy-slot>`,
  }),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('*')).not.toBeInTheDocument();
  },
};
