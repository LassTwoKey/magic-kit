import { nextTick, ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { expect, fn, userEvent } from 'storybook/test';

import MkPopover from './MkPopover.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkPopover.
 * Компонент MkPopover — всплывающее окно, привязанное к триггер-элементу.
 * Построен на `MkPopper` + `MkTooltipTrigger` + `MkTooltipContent`.
 *
 * Контент задаётся через `#content` слот.
 * Тип триггера: `trigger` (по умолчанию `'click'`, также `'hover'`, `'focus'`, `'contextmenu'`).
 * Управление видимостью: `v-model:visible` (реактивное) или controlled-режим (`:visible` без
 * `@update:visible` — тогда `controlled=true` и взаимодействие игнорируется).
 *
 * Стили настраиваются через CSS-переменные: `--popover-padding`, `--popover-color`,
 * `--popover-background`, `--popover-border-radius`, `--popover-box-shadow`.
 * Модификатор `mk-popover--dark` — тёмная тема.
 *
 * Задержки: `showAfter=0`, `hideAfter=200ms`.
 * Для тестов используется `:teleported="false"`.
 */
const meta = {
  title: 'Components/MkPopover',
  component: MkPopover,
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
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
  },
  decorators: [
    () => ({
      template: '<div style="padding: 100px 0"><story /></div>',
    }),
  ],
} satisfies Meta<typeof MkPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkPopover, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-popover v-bind="args" :teleported="false">
        <mk-button label="Click me" />
        <template #content>Popover content</template>
      </mk-popover>
    `,
  }),
  args: {
    placement: 'bottom',
    trigger: 'click',
    showArrow: false,
    disabled: false,
  },
};

export const TriggerVariants: Story = {
  name: 'Trigger Variants',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <div class="d-flex justify-center align-center ga-4">
        <mk-popover trigger="click" :teleported="false">
          <mk-button label="Click" />
          <template #content>Triggered by click</template>
        </mk-popover>

        <mk-popover trigger="hover" :teleported="false">
          <mk-button label="Hover" />
          <template #content>Triggered by hover</template>
        </mk-popover>

        <mk-popover trigger="focus" :teleported="false">
          <mk-button label="Focus" />
          <template #content>Triggered by focus</template>
        </mk-popover>

        <mk-popover trigger="contextmenu" :teleported="false">
          <mk-button label="Right click" />
          <template #content>Triggered by context menu</template>
        </mk-popover>
      </div>
    `,
  }),
};

export const PlacementVariants: Story = {
  name: 'Placement Variants',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <div class="d-flex flex-column align-center ga-4">
        <div class="d-flex justify-center ga-2">
          <mk-popover placement="top" :show-arrow="true" :teleported="false">
            <mk-button label="Top" />
            <template #content>Top popover</template>
          </mk-popover>
          <mk-popover placement="top-start" :show-arrow="true" :teleported="false">
            <mk-button label="Top Start" />
            <template #content>Top start</template>
          </mk-popover>
          <mk-popover placement="top-end" :show-arrow="true" :teleported="false">
            <mk-button label="Top End" />
            <template #content>Top end</template>
          </mk-popover>
        </div>
        <div class="d-flex justify-center ga-2">
          <mk-popover placement="left" :show-arrow="true" :teleported="false">
            <mk-button label="Left" />
            <template #content>Left popover</template>
          </mk-popover>
          <mk-popover placement="right" :show-arrow="true" :teleported="false">
            <mk-button label="Right" />
            <template #content>Right popover</template>
          </mk-popover>
        </div>
        <div class="d-flex justify-center ga-2">
          <mk-popover placement="bottom" :show-arrow="true" :teleported="false">
            <mk-button label="Bottom" />
            <template #content>Bottom popover</template>
          </mk-popover>
          <mk-popover placement="bottom-start" :show-arrow="true" :teleported="false">
            <mk-button label="Bottom Start" />
            <template #content>Bottom start</template>
          </mk-popover>
          <mk-popover placement="bottom-end" :show-arrow="true" :teleported="false">
            <mk-button label="Bottom End" />
            <template #content>Bottom end</template>
          </mk-popover>
        </div>
      </div>
    `,
  }),
};

export const WithArrow: Story = {
  name: 'With Arrow',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <div class="d-flex justify-center align-center ga-4">
        <mk-popover :show-arrow="true" :teleported="false" placement="bottom">
          <mk-button label="With Arrow" />
          <template #content>Popover with arrow</template>
        </mk-popover>

        <mk-popover :show-arrow="false" :teleported="false" placement="bottom">
          <mk-button label="No Arrow" />
          <template #content>Popover without arrow</template>
        </mk-popover>
      </div>
    `,
  }),
};

export const VModelControl: Story = {
  name: 'v-model:visible',
  render: () => ({
    components: { MkPopover, MkButton },
    setup() {
      const isVisible = ref(false);
      return { isVisible };
    },
    template: `
      <div class="d-flex flex-column align-center ga-4">
        <mk-button label="Toggle Popover" @click="isVisible = !isVisible" />
        <mk-popover
          v-model:visible="isVisible"
          :teleported="false"
          placement="bottom"
        >
          <mk-button :label="isVisible ? 'Open' : 'Closed'" />
          <template #content>Controlled via v-model</template>
        </mk-popover>
      </div>
    `,
  }),
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover :disabled="true" :teleported="false" placement="bottom">
        <mk-button label="Disabled popover" />
        <template #content>Should not appear</template>
      </mk-popover>
    `,
  }),
};

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover
        trigger="click"
        :teleported="false"
        placement="bottom"
        popper-class="mk-popover--dark"
      >
        <mk-button label="Dark popover" />
        <template #content>Popover with dark theme</template>
      </mk-popover>
    `,
  }),
};

export const CustomContent: Story = {
  name: 'Custom Content',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover
        trigger="click"
        :teleported="false"
        placement="bottom"
        :popper-style="{
          '--popover-box-shadow': '0 4px 20px rgba(0, 0, 0, 0.15)',
          '--popover-padding': '0'
        }"
      >
        <mk-button label="Custom content" />
        <template #content>
          <div style="padding: 16px">
            <div style="font-weight: 600; margin-bottom: 8px">Title</div>
            <div style="color: var(--mk-color-gray-500)">Description text here</div>
          </div>
        </template>
      </mk-popover>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: классы и стили
// ─────────────────────────────────────────────

export const AlwaysHasPopoverClass: Story = {
  name: 'Test: content всегда имеет класс mk-popover',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover :visible="true" :teleported="false" placement="bottom">
        <mk-button label="Trigger" />
        <template #content>Content</template>
      </mk-popover>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveClass('mk-popover');
  },
};

export const AppliesPopperClass: Story = {
  name: 'Test: popperClass добавляет класс к content',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover
        :visible="true"
        :teleported="false"
        placement="bottom"
        popper-class="my-custom-popover"
      >
        <mk-button label="Trigger" />
        <template #content>Content</template>
      </mk-popover>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content');
    await expect(content).toHaveClass('mk-popover');
    await expect(content).toHaveClass('my-custom-popover');
  },
};

export const AppliesPopperStyle: Story = {
  name: 'Test: popperStyle применяется как inline-стиль',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover
        :visible="true"
        :teleported="false"
        placement="bottom"
        :popper-style="{ '--popover-padding': '20px' }"
      >
        <mk-button label="Trigger" />
        <template #content>Styled content</template>
      </mk-popover>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const content = canvasElement.querySelector('.mk-popper-content') as HTMLElement;
    await expect(content).toBeInTheDocument();
    await expect(content.style.getPropertyValue('--popover-padding')).toBe('20px');
  },
};

export const ShowArrowRendersArrow: Story = {
  name: 'Test: showArrow=true добавляет .mk-popper-arrow в content',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover
        :visible="true"
        :show-arrow="true"
        :teleported="false"
        placement="bottom"
      >
        <mk-button label="Trigger" />
        <template #content>With arrow</template>
      </mk-popover>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const arrow = canvasElement.querySelector('.mk-popper-arrow');
    await expect(arrow).toBeInTheDocument();
  },
};

export const NoArrowByDefault: Story = {
  name: 'Test: showArrow=false (по умолчанию) не рендерит стрелку',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover :visible="true" :teleported="false" placement="bottom">
        <mk-button label="Trigger" />
        <template #content>No arrow</template>
      </mk-popover>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const arrow = canvasElement.querySelector('.mk-popper-arrow');
    await expect(arrow).not.toBeInTheDocument();
  },
};

// ─────────────────────────────────────────────
// Тесты: видимость и controlled-режим
// ─────────────────────────────────────────────

export const ControlledVisibleTrue: Story = {
  name: 'Test: visible=true показывает content (controlled)',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover :visible="true" :teleported="false" placement="bottom">
        <mk-button label="Trigger" />
        <template #content>Visible content</template>
      </mk-popover>
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
    components: { MkPopover, MkButton },
    template: `
      <mk-popover :visible="false" :persistent="true" :teleported="false" placement="bottom">
        <mk-button label="Trigger" />
        <template #content>Hidden content</template>
      </mk-popover>
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
  name: 'Test: disabled=true блокирует открытие при клике',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover :disabled="true" :persistent="true" :teleported="false">
        <mk-button label="Click me" />
        <template #content>Should not appear</template>
      </mk-popover>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.click(trigger);
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
    components: { MkPopover, MkButton },
    setup() {
      const isVisible = ref(false);
      return { isVisible };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
        <mk-button label="Toggle" @click="isVisible = !isVisible" />
        <mk-popover
          v-model:visible="isVisible"
          :persistent="true"
          :teleported="false"
        >
          <span>anchor</span>
          <template #content>Model content</template>
        </mk-popover>
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

export const ClickTriggerToggles: Story = {
  name: 'Test: trigger=click — клик открывает, повторный клик закрывает',
  render: () => ({
    components: { MkPopover, MkButton },
    template: `
      <mk-popover trigger="click" :persistent="true" :teleported="false" placement="bottom">
        <mk-button label="Click me" />
        <template #content>Toggle content</template>
      </mk-popover>
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

export const EmitsShow: Story = {
  name: 'Test: click эмитит событие show',
  render: (args) => ({
    components: { MkPopover, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-popover
        trigger="click"
        :teleported="false"
        placement="bottom"
        @show="args['onShow']"
      >
        <mk-button label="Click me" />
        <template #content>Content</template>
      </mk-popover>
    `,
  }),
  args: { onShow: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onShow = (args as Record<string, ReturnType<typeof fn>>)['onShow'];
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.click(trigger);
    await new Promise((r) => setTimeout(r, 50));
    await expect(onShow).toHaveBeenCalled();
  },
};

export const EmitsHide: Story = {
  name: 'Test: повторный клик эмитит событие hide',
  render: (args) => ({
    components: { MkPopover, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-popover
        trigger="click"
        :teleported="false"
        placement="bottom"
        @hide="args['onHide']"
      >
        <mk-button label="Click me" />
        <template #content>Content</template>
      </mk-popover>
    `,
  }),
  args: { onHide: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onHide = (args as Record<string, ReturnType<typeof fn>>)['onHide'];
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.click(trigger);
    await new Promise((r) => setTimeout(r, 50));
    await userEvent.click(trigger);
    await new Promise((r) => setTimeout(r, 250));
    await expect(onHide).toHaveBeenCalled();
  },
};

export const EmitsUpdateVisible: Story = {
  name: 'Test: v-model:visible эмитит update:visible при открытии',
  render: (args) => ({
    components: { MkPopover, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-popover
        trigger="click"
        :teleported="false"
        placement="bottom"
        @update:visible="args['onUpdateVisible']"
      >
        <mk-button label="Click me" />
        <template #content>Content</template>
      </mk-popover>
    `,
  }),
  args: { onUpdateVisible: fn() } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onUpdateVisible = (args as Record<string, ReturnType<typeof fn>>)['onUpdateVisible'];
    const trigger = canvasElement.querySelector('.mk-button') as HTMLElement;
    await userEvent.click(trigger);
    await new Promise((r) => setTimeout(r, 50));
    await expect(onUpdateVisible).toHaveBeenCalledWith(true);
  },
};
