<template>
  <div class="mk-dialog-wrapper">
    <!-- Триггер -->
    <slot
      name="trigger"
      :open="onTriggerClick"
    />

    <!-- Оверлей + диалог -->
    <MkPortal
      :disabled="false"
      to="body"
    >
      <Transition
        name="mk-dialog-overlay"
        @after-leave="onAfterLeave"
      >
        <div
          v-if="open"
          class="mk-dialog__overlay"
          :class="props.overlayClass"
          :style="{ zIndex: zIndexValue }"
          @click.self="onOverlayClick"
        >
          <div
            ref="dialogRef"
            class="mk-dialog"
            :class="props.dialogClass"
            :style="dialogStyles"
            role="dialog"
            aria-modal="true"
            :aria-label="props.title"
          >
            <!-- Хедер -->
            <div class="mk-dialog__header">
              <slot
                name="header"
                :close="handleClose"
              >
                <span class="mk-dialog__title">{{ props.title }}</span>
                <MkButton
                  v-if="props.showClose"
                  class="mk-dialog__close"
                  aria-label="Закрыть"
                  text
                  @click="handleClose"
                >
                  <template #icon>
                    <MkCloseIcon />
                  </template>
                </MkButton>
              </slot>
            </div>

            <!-- Контент -->
            <div class="mk-dialog__body">
              <slot />
            </div>

            <!-- Футер -->
            <div
              v-if="hasDefaultFooter"
              class="mk-dialog__footer"
              :class="`mk-dialog__footer--${props.footerAlign}`"
            >
              <slot
                name="footer"
                :close="handleClose"
                :ok="onOkClick"
                :cancel="onCancelClick"
              >
                <MkButton
                  v-if="props.showCancel"
                  :label="props.cancelLabel"
                  :variant="props.cancelDanger ? 'danger' : 'secondary'"
                  @click="onCancelClick"
                />
                <MkButton
                  v-if="props.showOk"
                  :label="props.okLabel"
                  variant="primary"
                  @click="onOkClick"
                />
              </slot>
            </div>
          </div>
        </div>
      </Transition>
    </MkPortal>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import { MkButton } from '@magic/kit/components/MkButton';
import { MkPortal } from '@magic/kit/components/MkPortal';
import { useEscapeKeydown, useZIndex } from '@magic/kit/hooks';
import { MkCloseIcon } from '@magic/kit/icons';

import { useDialogModelToggle } from './api';
import type { Props, Emits } from './api';

defineOptions({
  name: 'MkDialog',
});

const props = withDefaults(defineProps<Props>(), {
  visible: null,
  title: '',
  okLabel: 'ОК',
  cancelLabel: 'Отмена',
  showOk: true,
  showCancel: true,
  cancelDanger: false,
  footerAlign: 'right',
  width: undefined,
  maxWidth: undefined,
  showClose: true,
  closeOnClickOverlay: true,
  closeOnPressEscape: true,
  showOverlay: true,
  overlayClass: undefined,
  dialogClass: undefined,
  dialogStyle: undefined,
  disabled: false,
});

const emit = defineEmits<Emits>();
const slots = useSlots();

const dialogRef = ref<HTMLElement>();
const open = ref(false);
const toggleReason = ref<Event>();

const { nextZIndex } = useZIndex();
const zIndexValue = ref(0);

const { show, hide } = useDialogModelToggle({
  indicator: open,
  toggleReason,
  onShow: () => {
    zIndexValue.value = nextZIndex();
    lockScroll();
    emit('open');
  },
  onHide: () => {
    scheduleUnlockScroll();
    emit('close');
  },
});

/** Определяет нужно ли рендерить футер. */
const hasDefaultFooter = computed(() => {
  return !!slots.footer || props.showOk || props.showCancel;
});

/** Вычисленные стили диалога. */
const dialogStyles = computed(() => {
  const style: Record<string, string> = {};

  if (props.width) {
    const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
    style.width = w;
  }

  if (props.maxWidth) {
    const mw = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth;
    style.maxWidth = mw;
  }

  return [props.dialogStyle, style];
});

/** Обработчик клика на триггер. */
const onTriggerClick = (event?: Event) => {
  if (props.disabled) return;
  show(event);
};

/** Обработчик клика на оверлей. */
const onOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    hide();
  }
};

const handleClose = () => {
  hide();
};

const onOkClick = () => {
  emit('ok');
};

const onCancelClick = () => {
  emit('cancel');
  hide();
};

/** Ширина скроллбара до блокировки. */
let scrollbarWidth = 0;

const lockScroll = () => {
  scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.classList.add('mk-dialog-open');
  document.body.classList.add('mk-dialog-open');
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
};

const unlockScroll = () => {
  document.documentElement.classList.remove('mk-dialog-open');
  document.body.classList.remove('mk-dialog-open');
  document.body.style.paddingRight = '';
};

/** Сброс z-index после закрытия анимации. */
const onAfterLeave = () => {
  zIndexValue.value = 0;
};

/** Таймер отложенной разблокировки скролла. */
let unlockTimer: ReturnType<typeof setTimeout> | null = null;

/** Разблокировка скролла с небольшой задержкой. */
const scheduleUnlockScroll = () => {
  if (unlockTimer) clearTimeout(unlockTimer);
  unlockTimer = setTimeout(unlockScroll, 150);
};

// Снятие блокировки при уничтожении компонента
onBeforeUnmount(unlockScroll);

useEscapeKeydown((event) => {
  if (props.closeOnPressEscape && open.value) {
    hide(event);
  }
});

// Синхронизация с пропсом visible
watch(
  () => props.visible,
  (val) => {
    if (val === true && !open.value) {
      show();
    } else if (val === false && open.value) {
      hide();
    }
  }
);

defineExpose({
  dialogRef,
  show,
  hide,
});
</script>

<style src="./MkDialog.scss"></style>
