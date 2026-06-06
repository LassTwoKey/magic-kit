import { nextTick, ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { expect, fn, userEvent } from 'storybook/test';

import MkTooltip from './MkTooltip.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkTooltip.
 * Компонент MkTooltip — высокоуровневый составной компонент для всплывающих подсказок.
 * Объединяет `MkPopper` + `MkTooltipTrigger` + `MkTooltipContent` в единый API.
 *
 * Контент задаётся через `#content` слот или prop `content` (`rawContent=true` → HTML).
 * Тип триггера: `trigger` (по умолчанию `'hover'`, также `'click'`, `'focus'`, `'contextmenu'`).
 * Управление видимостью: `v-model:visible` (реактивное) или controlled-режим (`:visible` без
 * `@update:visible` — тогда `controlled=true` и взаимодействие игнорируется).
 * `kls` всегда включает `['mk-tooltip', popperClass]`, поэтому `.mk-popper-content`
 * всегда имеет класс `mk-tooltip`.
 *
 * Задержки по умолчанию: `showAfter=0`, `hideAfter=200ms`.
 * Тесты на закрытие ожидают 250ms. Для тестов используется `:teleported="false"`.
 */
const meta = {
  title: 'Components/Tooltip/MkTooltip',
  component: MkTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    trigger: {
      control: 'select',
      options: ['hover', 'click', 'focus', 'contextmenu'],
    },
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
} satisfies Meta<typeof MkTooltip>;

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
    placement: 'bottom',
    trigger: 'hover',
    disabled: false,
  },
};

export const MainVariants: Story = {
  name: 'View Variant',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <div class="d-flex justify-center align-center ga-4">
        <mk-tooltip content="This is a tooltip">
          <mk-button label="Hover me" />
        </mk-tooltip>

        <mk-tooltip
          content="Tooltip with arrow"
          :show-arrow="true"
        >
          <mk-button label="With arrow" />
        </mk-tooltip>

        <mk-tooltip
          content="Tooltip without arrow"
          :show-arrow="false"
        >
          <mk-button label="No arrow" />
        </mk-tooltip>
      </div>
    `,
  }),
};

export const PlacementVariants: Story = {
  name: 'Placement Variant',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <div class="d-flex flex-column align-center ga-4">
        <div class="d-flex justify-center ga-2">
          <mk-tooltip content="Top tooltip" placement="top" :show-arrow="true">
            <mk-button label="Top" />
          </mk-tooltip>
          <mk-tooltip content="Top start tooltip" placement="top-start" :show-arrow="true">
            <mk-button label="Top Start" />
          </mk-tooltip>
          <mk-tooltip content="Top end tooltip" placement="top-end" :show-arrow="true">
            <mk-button label="Top End" />
          </mk-tooltip>
        </div>
        <div class="d-flex justify-center ga-2">
          <mk-tooltip content="Left tooltip" placement="left" :show-arrow="true">
            <mk-button label="Left" />
          </mk-tooltip>
          <mk-tooltip content="Right tooltip" placement="right" :show-arrow="true">
            <mk-button label="Right" />
          </mk-tooltip>
        </div>
        <div class="d-flex justify-center ga-2">
          <mk-tooltip content="Bottom tooltip" placement="bottom" :show-arrow="true">
            <mk-button label="Bottom" />
          </mk-tooltip>
          <mk-tooltip content="Bottom start tooltip" placement="bottom-start" :show-arrow="true">
            <mk-button label="Bottom Start" />
          </mk-tooltip>
          <mk-tooltip content="Bottom end tooltip" placement="bottom-end" :show-arrow="true">
            <mk-button label="Bottom End" />
          </mk-tooltip>
        </div>
      </div>
    `,
  }),
};

export const ContentVariants: Story = {
  name: 'Content Variant',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <div class="d-flex justify-center align-center ga-4">
        <mk-tooltip content="Simple text content">
          <mk-button label="Text Content" />
        </mk-tooltip>

        <mk-tooltip
          content="<strong>HTML</strong> content with <em>formatting</em>"
          raw-content
        >
          <mk-button label="HTML Content" />
        </mk-tooltip>

        <mk-tooltip>
          <template #content>
            <div style="text-align: center">
              <div style="margin-bottom: 4px; font-weight: bold">Custom Slot Content</div>
              <div style="font-size: 12px; color: #999">With multiple lines</div>
            </div>
          </template>
          <mk-button label="Slot Content" />
        </mk-tooltip>
      </div>
    `,
  }),
};

export const DelaysVariants: Story = {
  name: 'Delays Variant',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <div class="d-flex flex-column justify-center align-center ga-4">
        <mk-tooltip content="Appears after 500ms" :show-after="500">
          <mk-button label="Delayed Show" />
        </mk-tooltip>

        <mk-tooltip content="Hides after 500ms" :hide-after="500">
          <mk-button label="Delayed Hide" />
        </mk-tooltip>

        <mk-tooltip content="Auto closes after 3 seconds" :auto-close="3000">
          <mk-button label="Auto Close" />
        </mk-tooltip>

        <mk-tooltip content="Combined delays: show 300ms, hide 400ms" :show-after="300" :hide-after="400">
          <mk-button label="Combined Delays" />
        </mk-tooltip>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: классы и стили
// ─────────────────────────────────────────────

export const AlwaysHasTooltipClass: Story = {
  name: 'Test: content всегда имеет класс mk-tooltip',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip :visible="true" :teleported="false" placement="bottom">
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

export const AppliesPopperClass: Story = {
  name: 'Test: popperClass добавляет класс к content',
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
// Тесты: контент
// ─────────────────────────────────────────────

export const RendersContentFromProp: Story = {
  name: 'Test: content prop рендерит текст внутри .mk-popper-content',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        content="Hello from prop"
        placement="bottom"
      >
        <mk-button label="Trigger" />
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveTextContent('Hello from prop');
  },
};

export const RendersRawHtml: Story = {
  name: 'Test: rawContent=true рендерит HTML из content prop',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :teleported="false"
        content="<strong class=&quot;raw-bold&quot;>Bold text</strong>"
        :raw-content="true"
        placement="bottom"
      >
        <mk-button label="Trigger" />
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const bold = canvasElement.querySelector('.mk-popper-content .raw-bold');
    await expect(bold).toBeInTheDocument();
    await expect(bold).toHaveTextContent('Bold text');
  },
};

export const ShowArrowRendersArrow: Story = {
  name: 'Test: showArrow=true добавляет .mk-popper-arrow в content',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip
        :visible="true"
        :show-arrow="true"
        :teleported="false"
        placement="bottom"
      >
        <mk-button label="Trigger" />
        <template #content>With arrow</template>
      </mk-tooltip>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const arrow = canvasElement.querySelector('.mk-popper-arrow');
    await expect(arrow).toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: видимость и controlled-режим
// ─────────────────────────────────────────────

export const ControlledVisibleTrue: Story = {
  name: 'Test: visible=true показывает content (controlled)',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip :visible="true" :teleported="false" placement="bottom">
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

export const ControlledVisibleFalse: Story = {
  name: 'Test: visible=false скрывает content (controlled)',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip :visible="false" :persistent="true" :teleported="false" placement="bottom">
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

export const DisabledPreventsOpen: Story = {
  name: 'Test: disabled=true блокирует открытие при наведении',
  render: () => ({
    components: { MkTooltip, MkButton },
    template: `
      <mk-tooltip :disabled="true" :persistent="true" :teleported="false">
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

// ─────────────────────────────────────────────
// Тесты: v-model и события
// ─────────────────────────────────────────────

export const VModelSyncsState: Story = {
  name: 'Test: v-model:visible — изменение ref управляет видимостью',
  render: () => ({
    components: { MkTooltip, MkButton },
    setup() {
      const isVisible = ref(false);
      return { isVisible };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
        <mk-button label="Toggle" @click="isVisible = !isVisible" />
        <mk-tooltip
          :visible="isVisible"
          :persistent="true"
          :teleported="false"
        >
          <span>anchor</span>
          <template #content>Model content</template>
        </mk-tooltip>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const toggleBtn = canvasElement.querySelector('.mk-button') as HTMLElement;
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).not.toBeVisible();
    await userEvent.click(toggleBtn);
    await new Promise((r) => setTimeout(r, 50));
    await expect(content).toBeVisible();
  },
};

export const EmitsShow: Story = {
  name: 'Test: hover эмитит событие show',
  render: (args) => ({
    components: { MkTooltip, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-tooltip
        trigger="hover"
        :teleported="false"
        placement="bottom"
        @show="args['onShow']"
      >
        <mk-button label="Hover me" />
        <template #content>Content</template>
      </mk-tooltip>
    `,
  }),
  args: { onShow: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onShow = (args as Record<string, ReturnType<typeof fn>>)['onShow'];
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.hover(trigger);
    await new Promise((r) => setTimeout(r, 50));
    await expect(onShow).toHaveBeenCalled();
  },
};

export const EmitsHide: Story = {
  name: 'Test: уход мышью эмитит событие hide',
  render: (args) => ({
    components: { MkTooltip, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-tooltip
        trigger="hover"
        :teleported="false"
        placement="bottom"
        @hide="args['onHide']"
      >
        <mk-button label="Hover me" />
        <template #content>Content</template>
      </mk-tooltip>
    `,
  }),
  args: { onHide: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onHide = (args as Record<string, ReturnType<typeof fn>>)['onHide'];
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.hover(trigger);
    await new Promise((r) => setTimeout(r, 50));
    await userEvent.unhover(trigger);
    await new Promise((r) => setTimeout(r, 250));
    await expect(onHide).toHaveBeenCalled();
  },
};
