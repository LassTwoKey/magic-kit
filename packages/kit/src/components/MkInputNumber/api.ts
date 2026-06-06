import type {
  Slots as MkInputSlots,
  Exposes as MkInputExposes,
} from '@magic/kit/components/MkInput/api';

export type Props = {
  /**
   * Привязка значения
   */
  modelValue?: number;
  /**
   * Кол-во знаков после запятой
   */
  precision?: number;
  /**
   * Разделение тысяч
   */
  useGrouping?: boolean;
  /**
   * Минимальное значение
   */
  min?: number;
  /**
   * Максимальное значение
   */
  max?: number;
};

export type SlotName = keyof MkInputSlots;

export type Slots = MkInputSlots;

export type Exposes = MkInputExposes;
