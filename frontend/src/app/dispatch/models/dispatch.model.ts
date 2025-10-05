import { ID } from '@datorama/akita';

export interface Dispatch {
  id?: ID | number;
  reference_no?: string;
  dispatch_plan_item_id: number;
  transporter_id?: number;
  plate_no?: string;
  driver_name?: string;
  driver_phone?: string;
  quantity: number;
  commodity_status?: string;
  remark?: string;
  prepared_by_id?: number;
  dispatch_status?: string;
}

export const EMPTY_DISPATCH: Dispatch = {
  id: null,
  reference_no: '',
  dispatch_plan_item_id: null,
  transporter_id: null,
  plate_no: 'SUP-PLATE-NO',
  driver_name: 'SUP-DRIVER-NAME',
  driver_phone: '0912323232',
  quantity: null,
  commodity_status: 'Good',
  remark: '',
  prepared_by_id: null
};
