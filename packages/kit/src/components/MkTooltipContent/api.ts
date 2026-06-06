import type { Props as MkPopperContentProps } from '@magic/kit/components/MkPopperContent/api';

export interface Props extends Omit<MkPopperContentProps, 'visible'> {
  /**
   * @description which element the tooltip CONTENT appends to
   */
  appendTo?: string | HTMLElement | null;
  /**
   * @description display content, can be overridden by `slot#content`
   */
  content?: string;
  /**
   * @description whether `content` is treated as HTML string
   */
  rawContent?: boolean;
  /**
   * @description when tooltip inactive and `persistent` is `false` , popconfirm will be destroyed
   */
  persistent?: boolean;
  /**
   * @description visibility of Tooltip
   */
  visible?: boolean | null;
  /**
   * @description animation name
   */
  transition?: string;
  /**
   * @description whether tooltip content is teleported, if `true` it will be teleported to where `append-to` sets
   */
  teleported?: boolean;
  /**
   * @description whether Tooltip is disabled
   */
  disabled?: boolean;
  /**
   * @description milliseconds before show
   */
  showAfter?: number;
  /**
   * @description milliseconds before hide
   */
  hideAfter?: number;
  /**
   * @description milliseconds to auto close, 0 means no auto close
   */
  autoClose?: number;
}
