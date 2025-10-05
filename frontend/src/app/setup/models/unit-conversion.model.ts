export interface UnitConversion {
    id: number;
    from_id: number;
    from_name?: string;
    to_id: number;
    to_name?: string;
    factor: number;
}
