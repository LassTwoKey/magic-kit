import { addDays } from 'date-fns';

import type { Marker } from '@vuepic/vue-datepicker';

/** Названия месяцев. */
export const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

/** Маркеры в ячейках */
export const markers = [
  {
    date: addDays(new Date(), 0),
    type: 'line',
  },
] satisfies Marker[];
