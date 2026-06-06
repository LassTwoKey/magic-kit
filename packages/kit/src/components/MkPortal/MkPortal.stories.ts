import { nextTick, onMounted, ref } from 'vue';
import { expect } from 'storybook/test';

import MkPortal from './MkPortal.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkPortal.
 * Компонент Portal — обёртка над встроенным Vue `<teleport>`, которая рендерит содержимое слота
 * в произвольный DOM-узел за пределами текущего дерева компонентов.
 * По умолчанию телепортирует в `body`. При `disabled=true` рендерит содержимое на месте,
 * не выполняя телепортацию — удобно для SSR или условного отключения.
 *
 * > **Важно:** в stories, где используется телепортация, `<mk-portal>` монтируется через
 * > `v-if="mounted"` (флаг ставится в `onMounted`). Это необходимо из-за порядка рендеринга Vue:
 * > дочерние элементы вставляются в VNode-дерево **до** того, как родитель попадает в `document`,
 * > поэтому `document.querySelector(to)` не находит элемент-цель при первом проходе mount и
 * > Vue создаёт сломанный teleport с `target=null`. При unmount это вызывает
 * > `TypeError: Cannot read properties of null (reading 'parentNode')`, роняя все последующие стори.
 * > После `onMounted` элемент-цель уже в `document`, и teleport разрешается корректно.
 */
const meta = {
  title: 'Components/MkPortal',
  component: MkPortal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    to: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof MkPortal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkPortal },
    setup() {
      const mounted = ref(false);
      onMounted(() => {
        mounted.value = true;
      });
      return { args, mounted };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div
          id="playground-portal-target"
          style="border: 1px dashed #aaa; border-radius: 4px; padding: 8px; min-height: 44px; font-size: 12px; color: #888;"
        >
          Target: #playground-portal-target
        </div>
        <div style="font-size: 12px; color: #888;">
          Source (MkPortal to="{{ args.disabled ? 'inline (disabled)' : (args.to || '#playground-portal-target') }}")
        </div>
        <mk-portal v-if="mounted" v-bind="args">
          <div style="background: #333; color: #fff; padding: 8px 12px; border-radius: 4px;">
            Portal content
          </div>
        </mk-portal>
      </div>
    `,
  }),
  args: {
    to: '#playground-portal-target',
    disabled: false,
  },
};

export const DisabledMode: Story = {
  name: 'Disabled (renders inline)',
  render: () => ({
    components: { MkPortal },
    template: `
      <div style="border: 2px dashed #999; padding: 16px; border-radius: 4px;">
        <p style="font-size: 12px; color: #888; margin-bottom: 8px;">Этот блок — место рендера</p>
        <mk-portal :disabled="true">
          <div style="background: #eee; padding: 8px 12px; border-radius: 4px;">
            Inline content (not teleported)
          </div>
        </mk-portal>
      </div>
    `,
  }),
};

export const CustomTarget: Story = {
  name: 'Custom Target',
  render: () => ({
    components: { MkPortal },
    setup() {
      const mounted = ref(false);
      onMounted(() => {
        mounted.value = true;
      });
      return { mounted };
    },
    template: `
      <div style="display: flex; gap: 32px; align-items: flex-start;">
        <div
          id="portal-visual-target"
          style="min-width: 180px; min-height: 44px; border: 1px dashed #999; border-radius: 4px; padding: 4px;"
        >
          <p style="font-size: 12px; color: #888; margin: 0 0 4px;">Target (#portal-visual-target)</p>
        </div>
        <div>
          <p style="font-size: 12px; color: #888; margin-bottom: 4px;">Source (MkPortal)</p>
          <mk-portal v-if="mounted" to="#portal-visual-target">
            <div style="background: #333; color: #fff; padding: 8px 12px; border-radius: 4px;">
              Teleported content
            </div>
          </mk-portal>
        </div>
      </div>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты
// ─────────────────────────────────────────────

export const TeleportsOutOfSource: Story = {
  name: 'Test: контент перемещается из источника в target',
  render: () => ({
    components: { MkPortal },
    setup() {
      const mounted = ref(false);
      onMounted(() => {
        mounted.value = true;
      });
      return { mounted };
    },
    template: `
      <div>
        <div id="test-out-target" />
        <div class="test-out-source">
          <mk-portal v-if="mounted" to="#test-out-target">
            <div class="test-out-content">Teleported</div>
          </mk-portal>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const source = canvasElement.querySelector('.test-out-source');
    const target = canvasElement.querySelector('#test-out-target');
    await expect(source?.querySelector('.test-out-content')).toBeNull();
    await expect(target?.querySelector('.test-out-content')).toBeInTheDocument();
  },
};

export const DisabledRendersInline: Story = {
  name: 'Test: disabled=true рендерит контент на месте',
  render: () => ({
    components: { MkPortal },
    template: `
      <div class="test-inline-source">
        <mk-portal :disabled="true">
          <div class="test-inline-content">Inline</div>
        </mk-portal>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const source = canvasElement.querySelector('.test-inline-source');
    await expect(source?.querySelector('.test-inline-content')).toBeInTheDocument();
  },
};

export const TeleportsToCustomTarget: Story = {
  name: 'Test: to — телепортирует в указанный элемент',
  render: () => ({
    components: { MkPortal },
    setup() {
      const mounted = ref(false);
      onMounted(() => {
        mounted.value = true;
      });
      return { mounted };
    },
    template: `
      <div>
        <div id="portal-test-target" />
        <mk-portal v-if="mounted" to="#portal-test-target">
          <div class="portal-custom-content">Custom target content</div>
        </mk-portal>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    await nextTick();
    const target = canvasElement.querySelector('#portal-test-target');
    await expect(target).toBeInTheDocument();
    const content = target?.querySelector('.portal-custom-content');
    await expect(content).toBeInTheDocument();
    await expect(content).toHaveTextContent('Custom target content');
  },
};

export const DisabledDoesNotTeleport: Story = {
  name: 'Test: disabled=true не переносит контент в target',
  render: () => ({
    components: { MkPortal },
    template: `
      <div>
        <div id="test-disabled-target" />
        <div class="test-disabled-source">
          <mk-portal to="#test-disabled-target" :disabled="true">
            <div class="test-disabled-content">Should stay in source</div>
          </mk-portal>
        </div>
      </div>
    `,
  }),
  play: async ({ canvasElement }) => {
    const source = canvasElement.querySelector('.test-disabled-source');
    const target = canvasElement.querySelector('#test-disabled-target');
    await expect(source?.querySelector('.test-disabled-content')).toBeInTheDocument();
    await expect(target?.querySelector('.test-disabled-content')).toBeNull();
  },
};
