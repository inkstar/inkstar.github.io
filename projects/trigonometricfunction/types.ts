export enum TrigFunction {
  SIN = 'SIN',
  COS = 'COS',
  TAN = 'TAN',
}

export interface Point {
  x: number;
  y: number;
}

export interface TrigConfig {
  color: string;
  label: string;
  description: string;
}