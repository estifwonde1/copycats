export interface ReceiptTransaction {
    id: number;
    receipt_number: string;
    receipt_id: number;
    destination_id: number;
    transaction_date: string;
    quantity: number;
    unit_id?: number;
    unit_abbreviation?: string;
    status: string;
    receipt_authorization_id?: number;
}

export const EMPTY_RECEIPT_TRANSACTION: ReceiptTransaction = {
    id: null,
    receipt_number: '',
    receipt_id: null,
    destination_id: null,
    transaction_date: '',
    quantity: null,
    status: ''
}
