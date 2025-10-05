import { ID } from '@datorama/akita';

export interface Dispatch {
  id: ID;
  reference_no?: string;
  allocation_item_id: number;
  transporter_id: number;
  plate_no: string;
  driver_name: string;
  driver_phone: string;
  quantity?: number;
  commodity_status?: string;
  remark?: string;
  prepared_by_id: number;
  dispatch_status?: string;
  unit_id?: number;
}

export const EMPTY_DISPATCH: Dispatch = {
  id: null,
  reference_no: '',
  allocation_item_id: null,
  transporter_id: null,
  plate_no: '',
  driver_name: '',
  driver_phone: '',
  quantity: null,
  commodity_status: 'Good',
  remark: '',
  prepared_by_id: null
};
