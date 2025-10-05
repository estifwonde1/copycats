export interface StackTransaction {
    id: number;
    source_id: number;
    destination_id: number;
    transaction_date: string;
    quantity: number;
    unit_id: number;
    status: string;
}

export const EMPTY_STACK_TRANSACTION: StackTransaction = {
    id: null,
    source_id: null,
    destination_id: null,
    transaction_date: '',
    quantity: null,
    unit_id: null,
    status: ''
}
