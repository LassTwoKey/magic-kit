import type { Component } from 'vue';

export type Props = {
  /**
   * Текст пункта
   */
  label?: string;
  /**
   * Иконка слева
   */
  icon?: string | Component;
  /**
   * Активный (выбранный) пункт
   */
  active?: boolean;
  /**
   * Заблокированный пункт
   */
  disabled?: boolean;
};

export type Emits = {
  /**
   * Emit для click
   */
  click: [event: MouseEvent];
};

export type Slots = {
  /**
   * Контент вместо label
   */
  default?: (props?: any) => any;
  /**
   * Иконка слева
   */
  prefixIcon?: (props?: any) => any;
  /**
   * Контент справа (синонимы, бейджи и т.д.)
   */
  suffix?: (props?: any) => any;
};
