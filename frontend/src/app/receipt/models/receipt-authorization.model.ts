export interface ReceiptAuthorization {
    id: number;
    store_id: number;
    store_name?: string;
    quantity: number;
    dispatch_id: number;
    authorized_by?: string;
    status?: string;
    received_quantity?: number;
    dispatch_reference_no?: string;
    unit_id?: number;
    unit_abbreviation?: string;
    dispatch_status?: string;
}

export const EMPTY_RECEIPT_AUTHORIZATION: ReceiptAuthorization = {
    id: null,
    store_id: null,
    quantity: null,
    dispatch_id: null
}
