export interface HubAuthorization {
    id: number;
    dispatch_plan_item_id: number;
    type: string;
    store_id: number;
    quantity: number;
    authorized_by_id?: number;
}

export class HubAuthorization {
    id: number;
    dispatch_plan_item_id: number;
    type: string;
    store_id: number;
    quantity: number;
    authorized_by_id?: number;
}

export const EMPTY_HUB_AUTHORIZATION: HubAuthorization = {
    id: null,
    dispatch_plan_item_id: null,
    type: '',
    store_id: null,
    quantity: null
}
