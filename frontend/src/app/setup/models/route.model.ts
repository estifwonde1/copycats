export interface Route {
    id: number;
    name: string;
    source_id: number;
    destination_id: number;
}

export const EMPTY_ROUTE: Route = {
    id: null,
    name: '',
    source_id: null,
    destination_id: null
}
