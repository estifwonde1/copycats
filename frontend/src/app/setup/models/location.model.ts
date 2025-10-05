import { ID } from '@datorama/akita';

export interface Location {
  id: ID;
  name: string;
  description: string;
  location_type: string;
  parent_id?: number;
}

export const EMPTY_LOCATION: Location = {
  id: null,
  name: '',
  description: '',
  location_type: '',
  parent_id: null
};
