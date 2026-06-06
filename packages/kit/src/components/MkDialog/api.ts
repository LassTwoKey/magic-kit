import { createModelToggleComposable } from '@magic/kit/hooks';

export const {
  useModelToggle: useDialogModelToggle,
  useModelToggleProps: useDialogModelToggleProps,
  useModelToggleEmits: useDialogModelToggleEmits,
} = createModelToggleComposable('visible');

/** Расположение кнопок футера. */
export type FooterAlign = 'left' | 'center' | 'right' | 'sides';

export type Props = {
  /**
   * Видимость диалога. Используется для v-model:visible.
   */
  visible?: boolean | null;
  /**
   * Заголовок диалога.
   */
  title?: string;
  /**
   * Текст кнопки ОК.
   */
  okLabel?: string;
  /**
   * Текст кнопки отмены.
   */
  cancelLabel?: string;
  /**
   * Показывать ли кнопку ОК.
   */
  showOk?: boolean;
  /**
   * Показывать ли кнопку отмены.
   */
  showCancel?: boolean;
  /**
   * Вариант danger для кнопки отмены.
   */
  cancelDanger?: boolean;
  /**
   * Расположение кнопок футера.
   */
  footerAlign?: FooterAlign;
  /**
   * Ширина диалога.
   */
  width?: string | number;
  /**
   * Максимальная ширина диалога.
   */
  maxWidth?: string | number;
  /**
   * Показывать ли кнопку закрытия (крестик) в хедере.
   */
  showClose?: boolean;
  /**
   * Закрытие по клику на оверлей.
   */
  closeOnClickOverlay?: boolean;
  /**
   * Закрытие по нажатию Escape.
   */
  closeOnPressEscape?: boolean;
  /**
   * Показывать ли оверлей.
   */
  showOverlay?: boolean;
  /**
   * Класс для оверлея.
   */
  overlayClass?: string;
  /**
   * CSS-класс для контейнера диалога.
   */
  dialogClass?: string;
  /**
   * Inline-стили для контейнера диалога.
   */
  dialogStyle?: Record<string, string>;
  /**
   * Заблокировать диалог.
   */
  disabled?: boolean;
};

export type Emits = {
  /**
   * Emit Привязка видимости. Используется для v-model:visible.
   */
  'update:visible': [val: boolean];
  /**
   * Emit Срабатывает при открытии.
   */
  open: [];
  /**
   * Emit Срабатывает при закрытии.
   */
  close: [];
  /**
   * Emit Срабатывает при клике на кнопку ОК.
   */
  ok: [];
  /**
   * Emit Срабатывает при клике на кнопку отмены.
   */
  cancel: [];
};

export type Slots = {
  /**
   * Slot элемент-триггер.
   */
  trigger?: () => any;
  /**
   * Slot хедера диалога.
   */
  header?: () => any;
  /**
   * Slot основного контента.
   */
  default?: () => any;
  /**
   * Slot футера диалога.
   */
  footer?: () => any;
};
