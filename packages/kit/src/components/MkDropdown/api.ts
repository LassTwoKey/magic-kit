import type { InputDropdownStatus } from './types';

import type { Component } from 'vue';
import type { Size } from '@magic/kit/types';
import type { Placement } from '@popperjs/core';

export type DropdownItem = {
  /**
   * Текст пункта
   */
  label: string;
  /**
   * Значение пункта
   */
  value: string;
  /**
   * Иконка слева
   */
  icon?: string | Component;
  /**
   * Заблокированный пункт
   */
  disabled?: boolean;
};

export type Props = {
  /**
   * Выбранное значение (value из items)
   */
  modelValue?: string;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * Массив пунктов
   */
  items?: DropdownItem[];
  /**
   * Заблокирован
   */
  disabled?: boolean;
  /**
   * Состояние ошибки
   */
  invalid?: boolean;
  /**
   * Текст ошибки снизу
   */
  error?: string;
  /**
   * Размер
   */
  size?: Size;
  /**
   * Показать preloader вместо стрелки
   */
  loading?: boolean;
  /**
   * Позиция выпадающей панели
   */
  placement?: Placement;
  /**
   * Телепортировать панель в body
   */
  teleported?: boolean;
  /**
   * Иконка слева от текста (проброс в MkInputDropdown)
   */
  prefixIcon?: string | Component;
  /**
   * Статус: progress, good, bad (проброс в MkInputDropdown)
   */
  status?: InputDropdownStatus;
  /**
   * Кружок статуса перед текстом (проброс в MkInputDropdown)
   */
  statusDot?: InputDropdownStatus;
  /**
   * Текст description (проброс в MkInputDropdown)
   */
  description?: string;
};

export type Emits = {
  /**
   * Emit для обновления modelValue
   */
  'update:modelValue': [value: string];
  /**
   * Emit при выборе пункта
   */
  change: [value: string];
};

export type Slots = {
  /**
   * Кастомный контент панели (заменяет items)
   */
  default?: (props?: any) => any;
  /**
   * Кастомный рендер пункта
   */
  item?: (props: { item: DropdownItem; index: number }) => any;
  /**
   * Иконка слева (проброс в MkInputDropdown)
   */
  prefixIcon?: (props?: any) => any;
  /**
   * Контент справа (проброс в MkInputDropdown)
   */
  suffixContent?: (props?: any) => any;
  /**
   * Sub buttons (проброс в MkInputDropdown)
   */
  subButtons?: (props?: any) => any;
};
