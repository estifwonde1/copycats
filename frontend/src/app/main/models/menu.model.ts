import { ID } from '@datorama/akita';

export interface Menu {
  id: ID;
  label: string;
  icon: string;
  route: string;
  menu_items: Array<Menu>;
}
