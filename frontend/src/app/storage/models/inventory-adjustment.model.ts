export interface InventoryAdjustment {
    id: number;
    reference_no: string;
    hub_id: number;
    hub_name: string;
    warehouse_id: number;
    warehouse_name: string;
    store_id: number;
    store_name: string;
    stack_id: number;
    stack_name: string;
    quantity: number;
    reason_for_adjustment: string;
    status?: string;
}

export const EMPTY_INVENTORY_ADJUSTMENT: InventoryAdjustment = {
    id: null,
    reference_no: '',
    hub_id: null,
    hub_name: '',
    warehouse_id: null,
    warehouse_name: '',
    store_id: null,
    store_name: '',
    stack_id: null,
    stack_name: '',
    quantity: null,
    reason_for_adjustment: ''
}
