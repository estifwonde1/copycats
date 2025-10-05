import { ID } from '@datorama/akita';

export interface Store {
  id: ID;
  name: string;
  store_keeper_name: string;
  store_keeper_phone: string;
  length: number;
  width: number;
  height: number;
  temporary?: boolean;
  has_gangway: boolean;
  gangway_length?: number;
  gangway_width?: number;
  gangway_corner_dist?: number;
  warehouse_id: number;
  stacks?: any[];
}

export const EMPTY_STORE: Store = {
  id: null,
  name: '',
  store_keeper_name: '',
  store_keeper_phone: '',
  length: null,
  width: null,
  height: null,
  has_gangway: false,
  warehouse_id: null,
  stacks: [],
  temporary: false
};
