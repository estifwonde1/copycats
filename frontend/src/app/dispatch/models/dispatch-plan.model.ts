import { ID } from '@datorama/akita';

export interface DispatchPlan {
  id?: ID;
  reference_no?: string;
  request_type?: string;
  request_id?: number;
  dispatchable_id?: number;
  request_reference_no?: string;
  status?: string;
  commodity_batch_no?: string;
  commodity_name?: string;
  quantity?: number;
  commodity_id?: number;
  request_quantity?: number;
  commodity_quantity?: number;
  upstream?: boolean;
}

export const EMPTY_DISPATCH_PLAN: DispatchPlan = {
  id: null,
  reference_no: '',
  request_type: '',
  request_id: null,
  commodity_id: null,
  status: 'Draft'
}
