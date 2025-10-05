import { ID } from '@datorama/akita';

export interface LostCommodity {
    id: ID;
    dispatch_id: number;
    quantity: number;
    commodity_status?: string;
    status?: string;
    remark?: string;
    prepared_by_id: number;
    dispatch_reference_no?: number;
}

export const EMPTY_LOST_COMMODITY: LostCommodity = {
    id: null,
    dispatch_id: null,
    quantity: null,
    commodity_status: 'Theft',
    status: 'Draft',
    remark: '',
    prepared_by_id: null
}
