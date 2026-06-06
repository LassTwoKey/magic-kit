import { StyleValue } from 'vue';

export type Props = {
  /**
   * Уникальный идентификатор элемента.
   * Используется в `v-model` родительского `MkAccordion`.
   */
  name: string | number;
  /**
   * Заголовок элемента — строка или VNode/рендер-функция.
   * Можно переопределить через слот `header`.
   */
  title?: string | (() => any);
  /**
   * Если `true`, элемент изначально раскрыт
   * (только когда нет v-model на родителе).
   */
  defaultOpen?: boolean;
  /**
   * Блокирует раскрытие элемента.
   */
  disabled?: boolean;
  /**
   * Классы для кастомизации Header.
   */
  headerClasses?: string;
  /**
   * Стили для DOM для кастомизации Header.
   */
  headerStyles?: StyleValue;
};

export type Emits = {
  /** Вызывается при открытии элемента. */
  open: [name: string | number];
  /** Вызывается при закрытии элемента. */
  close: [name: string | number];
};

export type Slots = {
  /** Контент заголовка. Передаёт `{ isOpen, disabled }`. */
  header: { isOpen: boolean; disabled: boolean };
  /** Дефолтный слот — тело элемента. */
  default: any;
  /** Иконка-индикатор раскрытия. Передаёт `{ isOpen }`. */
  icon: { isOpen: boolean };
};
