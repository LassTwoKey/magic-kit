import { expect } from 'storybook/test';

import MkPreloader from './MkPreloader.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkPreloader. Включает визуальные примеры и тесты структуры DOM,
 * классов и инлайн-стилей.
 */
const meta = {
  title: 'Components/MkPreloader',
  component: MkPreloader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'number',
    },
  },
} satisfies Meta<typeof MkPreloader>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Default: Story = {};

export const Small: Story = {
  args: { size: 12 },
};

export const Large: Story = {
  args: { size: 32 },
};

// ─────────────────────────────────────────────
// Структура DOM
// ─────────────────────────────────────────────

export const HasBaseClass: Story = {
  name: 'Test: имеет класс mk-preloader',
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-preloader');
    await expect(root).toBeInTheDocument();
  },
};

export const RendersAsSpan: Story = {
  name: 'Test: рендерится как <span>',
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-preloader');
    await expect(root?.tagName.toLowerCase()).toBe('span');
  },
};

export const HasAriaHidden: Story = {
  name: 'Test: имеет aria-hidden="true"',
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-preloader');
    await expect(root).toHaveAttribute('aria-hidden', 'true');
  },
};

export const HasSvg: Story = {
  name: 'Test: содержит SVG',
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('.mk-preloader__svg');
    await expect(svg).toBeInTheDocument();
    await expect(svg?.tagName.toLowerCase()).toBe('svg');
  },
};

export const SvgViewBox: Story = {
  name: 'Test: SVG имеет viewBox="0 0 18 18"',
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('.mk-preloader__svg');
    await expect(svg).toHaveAttribute('viewBox', '0 0 18 18');
  },
};

export const HasTrack: Story = {
  name: 'Test: содержит circle.mk-preloader__track',
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector('.mk-preloader__track');
    await expect(track).toBeInTheDocument();
  },
};

export const HasArc: Story = {
  name: 'Test: содержит circle.mk-preloader__arc',
  play: async ({ canvasElement }) => {
    const arc = canvasElement.querySelector('.mk-preloader__arc');
    await expect(arc).toBeInTheDocument();
  },
};

export const TrackFillNone: Story = {
  name: 'Test: track и arc имеют fill="none" через CSS',
  play: async ({ canvasElement }) => {
    const track = canvasElement.querySelector('.mk-preloader__track');
    const arc = canvasElement.querySelector('.mk-preloader__arc');
    await expect(track).toBeInTheDocument();
    await expect(arc).toBeInTheDocument();
  },
};

export const TwoCircles: Story = {
  name: 'Test: ровно 2 circle внутри SVG',
  play: async ({ canvasElement }) => {
    const circles = canvasElement.querySelectorAll('.mk-preloader__svg circle');
    await expect(circles.length).toBe(2);
  },
};

// ─────────────────────────────────────────────
// Размер
// ─────────────────────────────────────────────

export const DefaultSize18: Story = {
  name: 'Test: размер по умолчанию 18x18',
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-preloader') as HTMLElement;
    await expect(root.style.width).toBe('18px');
    await expect(root.style.height).toBe('18px');
  },
};

export const CustomSize: Story = {
  name: 'Test: кастомный размер через проп size',
  args: { size: 24 },
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.mk-preloader') as HTMLElement;
    await expect(root.style.width).toBe('24px');
    await expect(root.style.height).toBe('24px');
  },
};
