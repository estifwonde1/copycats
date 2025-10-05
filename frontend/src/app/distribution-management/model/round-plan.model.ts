export interface RoundPlan {
    id: number;
    reference_no: string;
    no_of_days: number;
    month: number;
    plan_id: number;
    status?: string;
}

export const EMPTY_ROUND_PLAN: RoundPlan = {
    id: null,
    reference_no: '',
    no_of_days: null,
    month: null,
    plan_id: null
}
