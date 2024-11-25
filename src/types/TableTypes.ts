import { ReactNode } from 'react';

export interface Row {
  [key: string]: string | number | boolean |  null;
}

export interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: any) => ReactNode;
}