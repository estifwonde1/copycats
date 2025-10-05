import { ID } from '@datorama/akita';

export interface DispatchTransaction {
    id: number;
    reference_no:string;
    source_id: number|ID;
    dispatch_authorization_id: number|ID;
    transaction_date: string;
    quantity: number;
    unit_id?: number;
    unit_abbreviation?: string;
}

export const EMPTY_DISPATCH_TRANSACTION: DispatchTransaction = {
    id: null,
    reference_no:'',
    source_id: null,
    dispatch_authorization_id: null,
    transaction_date: '',
    quantity: null
}
