import type { Component } from 'vue';

export type Props = {
  /**
   * Компонент иконки. При передаче slot игнорируется
   */
  icon?: Component | string;
  /**
   * Размер иконки. Число → px, строка → используется как есть (например '2em', '1.5rem')
   */
  size?: number | string;
  /**
   * Цвет иконки (CSS color value)
   */
  color?: string;
};

export type Slots = {
  /**
   * Slot для иконки — используется если не передан prop icon
   */
  default: any;
};
