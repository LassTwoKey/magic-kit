import type { Role } from './types';

import type { Ref } from 'vue';
import type { Instance } from '@popperjs/core';

export type Props = {
  /**
   * ARIA роль для контента Popper. По умолчанию 'tooltip'
   */
  role?: Role;
};

export type Exposes = {
  /**
   * Ссылка на элемент, который вызывает отображение Popper. Обычно это кнопка или другой интерактивный элемент
   */
  triggerRef?: Ref<HTMLElement | SVGElement | null | undefined>;
  /**
   * Ссылка на экземпляр Popper, который управляет позиционированием и отображением Popper
   */
  popperInstanceRef?: Ref<Instance | undefined>;
  /**
   * Ссылка на элемент, который содержит контент Popper. Это может быть всплывающая подсказка, меню или другой элемент, который отображается при взаимодействии с triggerRef
   */
  contentRef?: Ref<HTMLElement | undefined>;
  /**
   * Ссылка на элемент, относительно которого будет позиционироваться Popper. Обычно это тот же элемент, что и triggerRef, но может быть другим в зависимости от структуры DOM
   */
  referenceRef?: Ref<HTMLElement | undefined>;
  /**
   * ARIA роль для контента Popper. По умолчанию 'tooltip'
   */
  role?: Ref<Role>;
};
