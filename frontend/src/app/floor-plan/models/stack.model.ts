import { ID } from '@datorama/akita';

export interface Stack {
  id: ID;
  code: string;
  length: number;
  width: number;
  height: number;
  start_x: number;
  start_y: number;
  commodity_id: number;
  store_id: number;
  commodity_status?: string;
  stack_status?: string;
  quantity: number;
}

export const EMPTY_STACK: Stack = {
  id: null,
  code: '',
  length: null,
  width: null,
  height: null,
  start_x: null,
  start_y: null,
  commodity_id: null,
  store_id: null,
  commodity_status: '',
  stack_status: '',
  quantity: null,
};
