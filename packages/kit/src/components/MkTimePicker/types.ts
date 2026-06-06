export interface ColumnItem {
  key: string;
  value: number | null;
  label: string;
}

export interface Time {
  hours: number;
  minutes: number;
  seconds?: number;
}

export type ColumnType = 'hours' | 'minutes' | 'seconds';
