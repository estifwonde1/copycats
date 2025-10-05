export interface Role {
  id?: number;
  name: string;
  user_id?: number;
  role_id?: number;
  warehouse_id?: number;
  hub_id?: number;
}

export const EMPTY_ROLE: Role = {
  id: null,
  name: ''
};
