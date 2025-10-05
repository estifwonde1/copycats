import { ID } from '@datorama/akita';

export interface Receipt {
  id: ID;
  reference_no:string;
  dispatch_id: number;
  quantity: number;
  commodity_status?: string;
  commodity_grade?: string;
  status?: string;
  remark?: string;
  prepared_by_id: number;
  dispatch_reference_no?: number;
}

export const EMPTY_RECEIPT: Receipt = {
  id: null,
  reference_no:'',
  dispatch_id: null,
  quantity: null,
  commodity_status: 'Good',
  status: 'Draft',
  remark: '',
  prepared_by_id: null
};
