export interface RoundBeneficiary {
    id: number;
    beneficiary_id: number;
    round_plan_item_id: number;
    commodity_category_id: number;
    quantity: number;
    unit_id: number;
    received: boolean
}
