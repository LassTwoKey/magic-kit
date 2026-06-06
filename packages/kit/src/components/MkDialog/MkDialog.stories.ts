import { nextTick, ref } from 'vue';
import { MkButton } from '@magic/kit/components';
import { expect, fn, userEvent } from 'storybook/test';

import MkDialog from './MkDialog.vue';

import type { Meta, StoryObj } from '@storybook/vue3-vite';

/**
 * Истории для MkDialog.
 * Компонент MkDialog — модальное диалоговое окно с хедером, контентом и футером.
 *
 * Слоты:
 * - `#trigger` — элемент-триггер, получает `open` в props.
 * - `#header` — кастомный хедер (по умолчанию: заголовок + кнопка закрытия).
 * - `#default` — основной контент.
 * - `#footer` — кастомный футер (по умолчанию: кнопки ОК и Отмена).
 *
 * Управление видимостью: `v-model:visible` (реактивное).
 * Стили настраиваются через CSS-переменные.
 */
const meta = {
  title: 'Components/MkDialog',
  component: MkDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    footerAlign: {
      control: 'select',
      options: ['left', 'center', 'right', 'sides'],
    },
    cancelDanger: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    okLabel: {
      control: 'text',
    },
    cancelLabel: {
      control: 'text',
    },
    width: {
      control: 'text',
    },
    maxWidth: {
      control: 'text',
    },
  },
} satisfies Meta<typeof MkDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────
// Визуальные стори
// ─────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    components: { MkDialog, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-dialog v-bind="args">
        <template #trigger="{ open }">
          <mk-button label="Открыть диалог" @click="open" />
        </template>
        Это содержимое диалога по умолчанию.
      </mk-dialog>
    `,
  }),
  args: {
    title: 'Заголовок',
    okLabel: 'Сохранить',
    cancelLabel: 'Отмена',
    footerAlign: 'right',
    showClose: true,
    closeOnClickOverlay: true,
    closeOnPressEscape: true,
    showOk: true,
    showCancel: true,
    cancelDanger: false,
  },
};

export const BasicDialog: Story = {
  name: 'Базовый диалог',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog title="Подтверждение" ok-label="Удалить" cancel-label="Отмена">
        <template #trigger="{ open }">
          <mk-button label="Удалить элемент" @click="open" />
        </template>
        Вы уверены, что хотите удалить этот элемент? Это действие нельзя отменить.
      </mk-dialog>
    `,
  }),
};

export const FooterAlignVariants: Story = {
  name: 'Расположение кнопок футера',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <div class="d-flex ga-4 flex-wrap">
        <mk-dialog title="Слева" footer-align="left" ok-label="ОК" cancel-label="Отмена">
          <template #trigger="{ open }">
            <mk-button label="Слева" @click="open" />
          </template>
          Кнопки выровнены по левому краю.
        </mk-dialog>

        <mk-dialog title="По центру" footer-align="center" ok-label="ОК" cancel-label="Отмена">
          <template #trigger="{ open }">
            <mk-button label="По центру" @click="open" />
          </template>
          Кнопки выровнены по центру.
        </mk-dialog>

        <mk-dialog title="Справа" footer-align="right" ok-label="ОК" cancel-label="Отмена">
          <template #trigger="{ open }">
            <mk-button label="Справа" @click="open" />
          </template>
          Кнопки выровнены по правому краю.
        </mk-dialog>

        <mk-dialog title="По сторонам" footer-align="sides" ok-label="Сохранить" cancel-label="Удалить" :cancel-danger="true">
          <template #trigger="{ open }">
            <mk-button label="По сторонам" @click="open" />
          </template>
          Cancel слева (danger), ОК справа.
        </mk-dialog>
      </div>
    `,
  }),
};

export const OnlyOkButton: Story = {
  name: 'Только кнопка ОК',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog
        title="Уведомление"
        ok-label="Понятно"
        :show-cancel="false"
      >
        <template #trigger="{ open }">
          <mk-button label="Показать" @click="open" />
        </template>
        Это информационное сообщение без кнопки отмены.
      </mk-dialog>
    `,
  }),
};

export const CancelDanger: Story = {
  name: 'Cancel danger',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog
        title="Удалить элемент?"
        ok-label="Отмена"
        cancel-label="Удалить"
        :cancel-danger="true"
        footer-align="sides"
      >
        <template #trigger="{ open }">
          <mk-button label="Cancel danger" variant="danger" @click="open" />
        </template>
        Cancel-кнопка в варианте danger (красная), расположение по сторонам.
      </mk-dialog>
    `,
  }),
};

export const OnlyCancelButton: Story = {
  name: 'Только кнопка отмены',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog
        title="Информация"
        cancel-label="Закрыть"
        :show-ok="false"
      >
        <template #trigger="{ open }">
          <mk-button label="Информация" @click="open" />
        </template>
        Только кнопка отмены.
      </mk-dialog>
    `,
  }),
};

export const CustomWidth: Story = {
  name: 'Кастомная ширина',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <div class="d-flex ga-4">
        <mk-dialog title="Ширина 300px" width="300px" ok-label="ОК">
          <template #trigger="{ open }">
            <mk-button label="300px" @click="open" />
          </template>
          Диалог с фиксированной шириной 300px.
        </mk-dialog>

        <mk-dialog title="Max 400px" max-width="400px" ok-label="ОК">
          <template #trigger="{ open }">
            <mk-button label="Max 400px" @click="open" />
          </template>
          Диалог с максимальной шириной 400px, но может быть уже при маленьком контенте.
        </mk-dialog>
      </div>
    `,
  }),
};

export const CustomHeader: Story = {
  name: 'Кастомный хедер',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog ok-label="ОК" cancel-label="Отмена">
        <template #trigger="{ open }">
          <mk-button label="Кастомный хедер" @click="open" />
        </template>
        <template #header="{ close }">
          <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
            <span style="font-size: 20px;">&#x1F514;</span>
            <span style="font-weight: 600; font-size: 16px;">Уведомление</span>
          </div>
          <button
            style="display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; cursor: pointer; border-radius: 4px;"
            type="button"
            aria-label="Закрыть"
            @click="close"
          >
            &#x2715;
          </button>
        </template>
        Кастомный хедер использует метод close из слота для закрытия диалога.
      </mk-dialog>
    `,
  }),
};

export const CustomFooter: Story = {
  name: 'Кастомный футер',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog title="Кастомный футер">
        <template #trigger="{ open }">
          <mk-button label="Кастомный футер" @click="open" />
        </template>
        Кастомный футер использует методы close, ok и cancel из слота.
        <template #footer="{ close, ok, cancel }">
          <div style="display: flex; width: 100%; justify-content: space-between;">
            <mk-button label="Удалить" variant="danger" outline @click="close" />
            <div style="display: flex; gap: 8px;">
              <mk-button label="Отмена" outline @click="cancel" />
              <mk-button label="Сохранить" variant="primary" @click="ok" />
            </div>
          </div>
        </template>
      </mk-dialog>
    `,
  }),
};

export const VModelControl: Story = {
  name: 'v-model:visible',
  render: () => ({
    components: { MkDialog, MkButton },
    setup() {
      const isVisible = ref(false);
      return { isVisible };
    },
    template: `
      <div class="d-flex flex-column align-center ga-4">
        <mk-button :label="isVisible ? 'Закрыть' : 'Открыть'" @click="isVisible = !isVisible" />
        <mk-dialog v-model:visible="isVisible" title="Управляемый диалог" ok-label="ОК">
          Этот диалог управляется через v-model:visible.
        </mk-dialog>
      </div>
    `,
  }),
};

export const CustomCSSVariables: Story = {
  name: 'Кастомизация через CSS-переменные',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog
        title="Кастомные стили"
        ok-label="Принять"
        cancel-label="Отклонить"
        :dialog-style="{
          '--dialog-border-radius': '16px',
          '--dialog-padding': '32px',
          '--dialog-box-shadow': '0 12px 48px rgba(0, 0, 0, 0.2)',
          '--dialog-title-font-size': '20px',
          '--dialog-footer-padding': '32px 0 0',
        }"
      >
        <template #trigger="{ open }">
          <mk-button label="Кастомные стили" @click="open" />
        </template>
        Диалог с кастомными CSS-переменными: увеличенный padding, скругление и тень.
      </mk-dialog>
    `,
  }),
};

export const NoCloseButton: Story = {
  name: 'Без кнопки закрытия',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog title="Без крестика" :show-close="false" ok-label="Закрыть" :show-cancel="false">
        <template #trigger="{ open }">
          <mk-button label="Без крестика" @click="open" />
        </template>
        Диалог без кнопки закрытия в хедере. Закрыть можно только кнопкой внизу или Escape.
      </mk-dialog>
    `,
  }),
};

export const PreventOverlayClose: Story = {
  name: 'Без закрытия по оверлею',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog
        title="Не закрывается по клику"
        :close-on-click-overlay="false"
        ok-label="Закрыть"
        :show-cancel="false"
      >
        <template #trigger="{ open }">
          <mk-button label="Без overlay close" @click="open" />
        </template>
        Клик по затемнённому фону не закроет этот диалог.
      </mk-dialog>
    `,
  }),
};

// ─────────────────────────────────────────────
// Тесты: видимость и события
// ─────────────────────────────────────────────

export const TriggerOpensDialog: Story = {
  name: 'Test: клик по триггеру открывает диалог',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog title="Test Dialog" ok-label="OK">
        <template #trigger="{ open }">
          <mk-button data-testid="trigger" label="Open" @click="open" />
        </template>
        Test content
      </mk-dialog>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    await userEvent.click(trigger);
    await nextTick();
    await new Promise((r) => setTimeout(r, 50));
    const dialog = document.querySelector('.mk-dialog');
    await expect(dialog).toBeInTheDocument();
    await expect(dialog).toBeVisible();
  },
};

export const CloseButtonClickEmitsClose: Story = {
  name: 'Test: клик по крестику закрывает диалог',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog title="Test" ok-label="OK">
        <template #trigger="{ open }">
          <mk-button data-testid="trigger" label="Open" @click="open" />
        </template>
        Content
      </mk-dialog>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    await userEvent.click(trigger);
    await nextTick();
    const closeBtn = document.querySelector('.mk-dialog__close') as HTMLElement;
    await expect(closeBtn).toBeInTheDocument();
    await userEvent.click(closeBtn);
    await nextTick();
    await new Promise((r) => setTimeout(r, 350));
    const dialog = document.querySelector('.mk-dialog');
    await expect(dialog).not.toBeInTheDocument();
  },
};

export const EmitsOpenAndClose: Story = {
  name: 'Test: эмитит события open и close',
  render: (args) => ({
    components: { MkDialog, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-dialog
        title="Test"
        ok-label="OK"
        @open="args['onOpen']"
        @close="args['onClose']"
      >
        <template #trigger="{ open }">
          <mk-button data-testid="trigger" label="Open" @click="open" />
        </template>
        Content
      </mk-dialog>
    `,
  }),
  args: {
    onOpen: fn(),
    onClose: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onOpen = (args as Record<string, ReturnType<typeof fn>>)['onOpen'];
    const onClose = (args as Record<string, ReturnType<typeof fn>>)['onClose'];
    const trigger = canvasElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    await userEvent.click(trigger);
    await nextTick();
    await expect(onOpen).toHaveBeenCalled();
    const closeBtn = document.querySelector('.mk-dialog__close') as HTMLElement;
    await userEvent.click(closeBtn);
    await nextTick();
    await new Promise((r) => setTimeout(r, 350));
    await expect(onClose).toHaveBeenCalled();
  },
};

export const EmitsOk: Story = {
  name: 'Test: эмитит событие ok',
  render: (args) => ({
    components: { MkDialog, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-dialog
        title="Test"
        ok-label="OK"
        @ok="args['onOk']"
      >
        <template #trigger="{ open }">
          <mk-button data-testid="trigger" label="Open" @click="open" />
        </template>
        Content
      </mk-dialog>
    `,
  }),
  args: {
    onOk: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onOk = (args as Record<string, ReturnType<typeof fn>>)['onOk'];
    const trigger = canvasElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    await userEvent.click(trigger);
    await nextTick();
    const okBtn = document.querySelector('.mk-dialog__footer .mk-button--primary') as HTMLElement;
    await userEvent.click(okBtn);
    await expect(onOk).toHaveBeenCalled();
  },
};

export const EmitsCancel: Story = {
  name: 'Test: эмитит событие cancel и закрывает',
  render: (args) => ({
    components: { MkDialog, MkButton },
    setup() {
      return { args };
    },
    template: `
      <mk-dialog
        title="Test"
        ok-label="OK"
        cancel-label="Cancel"
        @cancel="args['onCancel']"
      >
        <template #trigger="{ open }">
          <mk-button data-testid="trigger" label="Open" @click="open" />
        </template>
        Content
      </mk-dialog>
    `,
  }),
  args: {
    onCancel: fn(),
  } as Story['args'],
  play: async ({ canvasElement, args }) => {
    const onCancel = (args as Record<string, ReturnType<typeof fn>>)['onCancel'];
    const trigger = canvasElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    await userEvent.click(trigger);
    await nextTick();
    const cancelBtn = document.querySelector(
      '.mk-dialog__footer .mk-button:not(.mk-button--primary)'
    ) as HTMLElement;
    await userEvent.click(cancelBtn);
    await expect(onCancel).toHaveBeenCalled();
  },
};

export const FooterAlignClasses: Story = {
  name: 'Test: footer-align добавляет соответствующий класс',
  render: () => ({
    components: { MkDialog, MkButton },
    template: `
      <mk-dialog title="Test" footer-align="center" ok-label="OK" cancel-label="Cancel">
        <template #trigger="{ open }">
          <mk-button data-testid="trigger" label="Open" @click="open" />
        </template>
        Content
      </mk-dialog>
    `,
  }),
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector('[data-testid="trigger"]') as HTMLElement;
    await userEvent.click(trigger);
    await nextTick();
    const footer = document.querySelector('.mk-dialog__footer');
    await expect(footer).toHaveClass('mk-dialog__footer--center');
  },
};
