import { ID } from '@datorama/akita';

export interface DispatchPlanItem {
  id?: ID;
  commodity_id: number;
  dispatch_plan_id: number;
  destination_id: number;
  source_id: number;
  quantity: number;
  destination_location_type?: string;
  source_location_type?: string;
  destination_name?: string;
  source_name?: string;
  commodity_status?: string;
}

export const EMPTY_DISPATCH_PLAN_ITEM: DispatchPlanItem = {
  id: null,
  commodity_id: null,
  dispatch_plan_id: null,
  destination_id: null,
  source_id: null,
  quantity: null,
}
