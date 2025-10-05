export interface DispatchAuthorization {
    id: number;
    store_id: number;
    store_name?: string;
    quantity: number;
    dispatch_id: number;
    authorized_by?: string;
    status?: string;
    dispatch_reference_no?: string;
    driver_name?: string;
    unit_id?: number;
    unit_abbreviation?: string;
    plate_no?: string;
}

export const EMPTY_DISPATCH_AUTHORIZATION: DispatchAuthorization = {
    id: null,
    store_id: null,
    quantity: null,
    dispatch_id: null
}
