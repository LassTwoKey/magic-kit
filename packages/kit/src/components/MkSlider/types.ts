export interface Mark {
  style?: Record<string, string>;
  label?: string;
}

export type MarksProp = Record<number, string | Mark>;
